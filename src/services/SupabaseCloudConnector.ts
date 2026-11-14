import AsyncStorage from "@react-native-async-storage/async-storage";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
const SYNC_CODE_STORAGE_KEY = "salus_cloud_sync_code";
const LAST_SYNC_STORAGE_KEY = "salus_cloud_last_sync";

export interface CloudSyncResult {
  ok: boolean;
  mode: "supabase" | "local-only";
  syncCode: string;
  syncedKeysCount: number;
  timestamp: string;
  message: string;
}

function generateSyncCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SALUS-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

class SupabaseCloudConnectorService {
  isConfigured(): boolean {
    return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
  }

  async getOrCreateSyncCode(): Promise<string> {
    const existing = await AsyncStorage.getItem(SYNC_CODE_STORAGE_KEY);
    if (existing) return existing;
    const fresh = generateSyncCode();
    await AsyncStorage.setItem(SYNC_CODE_STORAGE_KEY, fresh);
    return fresh;
  }

  async setSyncCode(newCode: string): Promise<string> {
    const cleaned = newCode.trim().toUpperCase();
    if (!cleaned) return this.getOrCreateSyncCode();
    await AsyncStorage.setItem(SYNC_CODE_STORAGE_KEY, cleaned);
    return cleaned;
  }

  async getLastSyncTime(): Promise<string | null> {
    return AsyncStorage.getItem(LAST_SYNC_STORAGE_KEY);
  }

  private async gatherLocalSalusRecords(): Promise<{
    records: Record<string, string>;
    streakCount: number;
    calmXp: number;
  }> {
    const allKeys = await AsyncStorage.getAllKeys();
    const salusKeys = allKeys.filter(
      (k) =>
        k.startsWith("salus_") &&
        k !== SYNC_CODE_STORAGE_KEY &&
        k !== LAST_SYNC_STORAGE_KEY
    );
    const pairs = await AsyncStorage.multiGet(salusKeys);
    const records: Record<string, string> = {};

    let ritualsSum = 0;
    let moodCheckins = 0;
    let streakCount = 1;

    for (const [key, val] of pairs) {
      if (val === null) continue;
      records[key] = val;

      if (key === "salus_streak_count") {
        streakCount = parseInt(val, 10) || 1;
      } else if (key.startsWith("salus_quests_")) {
        try {
          const arr = JSON.parse(val);
          if (Array.isArray(arr)) ritualsSum += arr.length;
        } catch {}
      } else if (key.startsWith("salus_mood_")) {
        moodCheckins += 1;
      }
    }

    const calmXp = ritualsSum * 25 + moodCheckins * 15 + streakCount * 10;
    return { records, streakCount, calmXp };
  }

  async syncNow(overrideCode?: string): Promise<CloudSyncResult> {
    const syncCode = overrideCode
      ? await this.setSyncCode(overrideCode)
      : await this.getOrCreateSyncCode();

    const { records: localRecords, streakCount, calmXp } =
      await this.gatherLocalSalusRecords();
    const nowIso = new Date().toISOString();

    if (!this.isConfigured()) {
      await AsyncStorage.setItem(LAST_SYNC_STORAGE_KEY, nowIso);
      return {
        ok: true,
        mode: "local-only",
        syncCode,
        syncedKeysCount: Object.keys(localRecords).length,
        timestamp: nowIso,
        message: `Local snapshot ready (${Object.keys(localRecords).length} items). Add EXPO_PUBLIC_SUPABASE_URL & ANON_KEY for live cloud sync.`,
      };
    }

    const endpoint = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/salus_sanctuary_sync`;
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    };

    try {
      // 1. Fetch existing cloud state for this syncCode
      const getRes = await fetch(
        `${endpoint}?sync_code=eq.${encodeURIComponent(syncCode)}&select=*`,
        { method: "GET", headers }
      );

      let mergedRecords: Record<string, string> = { ...localRecords };
      let mergedStreak = streakCount;

      if (getRes.ok) {
        const rows = await getRes.json();
        if (Array.isArray(rows) && rows.length > 0) {
          const remote = rows[0];
          const remoteRecords: Record<string, string> = remote.records || {};
          // Merge remote keys and local keys (local takes precedence for today's edits, remote fills missing days)
          mergedRecords = { ...remoteRecords, ...localRecords };

          const remoteStreak = Number(remote.streak_count) || 1;
          mergedStreak = Math.max(streakCount, remoteStreak);
          mergedRecords["salus_streak_count"] = String(mergedStreak);

          // Persist merged state back to local AsyncStorage
          const kvPairs = Object.entries(mergedRecords);
          if (kvPairs.length > 0) {
            await AsyncStorage.multiSet(kvPairs);
          }
        }
      }

      // 2. Upsert merged snapshot back to Supabase
      const upsertRes = await fetch(endpoint, {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify({
          sync_code: syncCode,
          streak_count: mergedStreak,
          calm_xp: calmXp,
          records: mergedRecords,
          updated_at: nowIso,
        }),
      });

      if (!upsertRes.ok) {
        const errText = await upsertRes.text();
        throw new Error(errText || `HTTP ${upsertRes.status}`);
      }

      await AsyncStorage.setItem(LAST_SYNC_STORAGE_KEY, nowIso);

      return {
        ok: true,
        mode: "supabase",
        syncCode,
        syncedKeysCount: Object.keys(mergedRecords).length,
        timestamp: nowIso,
        message: `Synced ${Object.keys(mergedRecords).length} sanctuary records to Supabase Cloud!`,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      return {
        ok: false,
        mode: "supabase",
        syncCode,
        syncedKeysCount: Object.keys(localRecords).length,
        timestamp: nowIso,
        message: `Cloud sync failed: ${msg}`,
      };
    }
  }
}

export const supabaseCloudConnector = new SupabaseCloudConnectorService();
