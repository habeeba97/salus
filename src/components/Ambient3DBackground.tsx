import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Platform } from "react-native";

export function Ambient3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const particles = Array.from({ length: 36 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.9 + Math.random() * 2,
      vy: 0.0003 + Math.random() * 0.0006,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const w = typeof window !== "undefined" ? window.innerWidth : 390;
      const h = typeof window !== "undefined" ? window.innerHeight : 844;

      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      t += 0.014;

      const bgGrad = ctx.createLinearGradient(0, 0, w * 0.4, h);
      bgGrad.addColorStop(0, "#070811");
      bgGrad.addColorStop(0.5, "#0D1126");
      bgGrad.addColorStop(1, "#070811");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      particles.forEach((p) => {
        p.y -= p.vy;
        if (p.y < -0.02) p.y = 1.02;
        const a = 0.2 + 0.45 * Math.abs(Math.sin(t + p.phase));
        ctx.fillStyle = `rgba(129, 140, 248, ${a.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (Platform.OS !== "web") {
    return <View style={styles.nativeBg} />;
  }

  return (
    <View pointerEvents="none" style={styles.container}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  nativeBg: { ...StyleSheet.absoluteFillObject, backgroundColor: "#070811", zIndex: 0 },
});
