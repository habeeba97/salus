import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Platform } from "react-native";

export function Ambient3DBackground({ clearView = false }: { clearView?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const motes = Array.from({ length: 55 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1 + Math.random() * 2.8,
      vy: 0.0005 + Math.random() * 0.001,
      vx: (Math.random() - 0.5) * 0.0005,
      phase: Math.random() * Math.PI * 2,
    }));

    // Draw volumetric rim-lit human silhouette with smooth tapered limbs
    const drawTaperedLimb = (
      x1: number,
      y1: number,
      cx: number,
      cy: number,
      x2: number,
      y2: number,
      widthStart: number,
      widthEnd: number
    ) => {
      const steps = 16;
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const inv = 1 - u;
        const px = inv * inv * x1 + 2 * inv * u * cx + u * u * x2;
        const py = inv * inv * y1 + 2 * inv * u * cy + u * u * y2;
        const radius = (widthStart * inv + widthEnd * u) * 0.5;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawCinematicPerformer = (
      cx: number,
      cy: number,
      scale: number,
      phase: number,
      sceneIdx: number,
      alpha: number
    ) => {
      if (alpha <= 0.01) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha;

      // Studio Backlight Halo (FitOn Golden / Teal / Violet Rim Light)
      const lightColors = [
        ["rgba(251, 191, 36, 0.34)", "rgba(244, 114, 182, 0.14)"],
        ["rgba(56, 189, 248, 0.34)", "rgba(52, 211, 153, 0.14)"],
        ["rgba(192, 132, 252, 0.34)", "rgba(99, 102, 241, 0.14)"],
      ];
      const [c1, c2] = lightColors[sceneIdx];

      const sunHalo = ctx.createRadialGradient(0, -35, 12, 0, -20, 210);
      sunHalo.addColorStop(0, c1);
      sunHalo.addColorStop(0.55, c2);
      sunHalo.addColorStop(1, "transparent");
      ctx.fillStyle = sunHalo;
      ctx.beginPath();
      ctx.arc(0, -20, 210, 0, Math.PI * 2);
      ctx.fill();

      // Volumetric Body Fill + Glowing Rim Shadow
      const rimColor =
        sceneIdx === 0 ? "#FDE68A" : sceneIdx === 1 ? "#7DD3FC" : "#F5D0FE";
      const bodyGrad = ctx.createLinearGradient(-50, -100, 50, 140);
      bodyGrad.addColorStop(0, rimColor);
      bodyGrad.addColorStop(0.45, "rgba(30, 41, 59, 0.88)");
      bodyGrad.addColorStop(1, "rgba(15, 23, 42, 0.95)");

      ctx.fillStyle = bodyGrad;
      ctx.shadowColor = rimColor;
      ctx.shadowBlur = 22;

      const breath = Math.sin(phase);
      const flow = Math.sin(phase * 0.5);

      if (sceneIdx === 0) {
        // CLIP 1: Dynamic Sun Salutation & Side-Bend Reach
        const lean = flow * 0.18;
        const armLift = (breath + 1) * 0.5; // 0 to 1

        // Left & Right Sculpted Legs
        drawTaperedLimb(-10, 28, -24, 82, -32, 142, 22, 11);
        drawTaperedLimb(10, 28, 24, 82, 32, 142, 22, 11);

        ctx.save();
        ctx.rotate(lean);

        // Sculpted Torso (hips to shoulders)
        drawTaperedLimb(0, 32, 0, -4, 0, -42, 26, 34);

        // Head & Neck
        drawTaperedLimb(0, -42, 0, -52, 0, -62, 11, 10);
        ctx.beginPath();
        ctx.arc(0, -75, 15, 0, Math.PI * 2);
        ctx.fill();

        // Sweeping Overhead Arms
        const handX = 28 - armLift * 20;
        const handY = -36 - armLift * 76;
        const elbowX = 48 - armLift * 14;
        const elbowY = -38 - armLift * 36;

        drawTaperedLimb(-15, -38, -elbowX, elbowY, -handX, handY, 12, 7);
        drawTaperedLimb(15, -38, elbowX, elbowY, handX, handY, 12, 7);

        ctx.restore();
      } else if (sceneIdx === 1) {
        // CLIP 2: Warrior Flow & Tai-Chi Energy Wave
        const shift = flow * 18;

        // Wide Athletic Warrior Stance
        drawTaperedLimb(shift - 8, 28, shift - 38, 78, -56, 142, 23, 11);
        drawTaperedLimb(shift + 8, 28, shift + 42, 82, 62, 142, 23, 11);

        // Torso
        drawTaperedLimb(shift, 32, shift * 0.85, -4, shift * 0.75, -42, 26, 34);

        // Head
        ctx.beginPath();
        ctx.arc(shift * 0.75, -74, 15, 0, Math.PI * 2);
        ctx.fill();

        // Flowing Extended Warrior Arms
        drawTaperedLimb(
          shift * 0.75 - 15,
          -36,
          shift - 52,
          -44 + breath * 14,
          shift - 96,
          -34 - breath * 14,
          12,
          7
        );
        drawTaperedLimb(
          shift * 0.75 + 15,
          -36,
          shift + 52,
          -44 - breath * 14,
          shift + 96,
          -34 + breath * 14,
          12,
          7
        );
      } else {
        // CLIP 3: Meditative Lotus & Expanding Breath Aura
        // Crossed Lotus Legs
        drawTaperedLimb(-8, 34, -46, 36, -54, 62, 22, 12);
        drawTaperedLimb(-54, 62, -24, 72, 14, 60, 12, 9);
        drawTaperedLimb(8, 34, 46, 36, 54, 62, 22, 12);
        drawTaperedLimb(54, 62, 24, 72, -14, 60, 12, 9);

        // Spine & Shoulders
        drawTaperedLimb(0, 36, 0, 0, 0, -38, 27, 34);

        // Head
        ctx.beginPath();
        ctx.arc(0, -70, 15, 0, Math.PI * 2);
        ctx.fill();

        // Mudra Arms
        drawTaperedLimb(-15, -32, -38, 6, -50, 52 - breath * 5, 11, 7);
        drawTaperedLimb(15, -32, 38, 6, 50, 52 - breath * 5, 11, 7);

        // Glowing Heart Coherence Ring
        ctx.strokeStyle = rimColor;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(0, -10, 24 + (breath + 1) * 22, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    };

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
      t += 0.022;

      // Cinematic Atmospheric Backdrop
      const cycleDuration = 8.0;
      const totalCycle = cycleDuration * 3;
      const modT = t % totalCycle;
      const currentScene = Math.floor(modT / cycleDuration);
      const nextScene = (currentScene + 1) % 3;
      const localProgress = (modT % cycleDuration) / cycleDuration;
      const fadeProgress = localProgress > 0.78 ? (localProgress - 0.78) / 0.22 : 0;

      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (currentScene === 0) {
        bgGrad.addColorStop(0, "#140C24");
        bgGrad.addColorStop(0.5, "#1E1438");
        bgGrad.addColorStop(1, "#090B16");
      } else if (currentScene === 1) {
        bgGrad.addColorStop(0, "#071926");
        bgGrad.addColorStop(0.5, "#0D2B3E");
        bgGrad.addColorStop(1, "#060B16");
      } else {
        bgGrad.addColorStop(0, "#120B29");
        bgGrad.addColorStop(0.5, "#231247");
        bgGrad.addColorStop(1, "#070914");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Rolling Horizon Waves (Ocean / Studio Floor Reflection)
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        const wy = h * (0.62 + wave * 0.09);
        ctx.moveTo(0, wy);
        for (let x = 0; x <= w; x += 20) {
          const y = wy + Math.sin(x * 0.01 + t * 1.1 + wave * 1.8) * 14;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.025 + wave * 0.01})`;
        ctx.fill();
      }

      const maxAlpha = clearView ? 0.96 : 0.78;
      const currentAlpha = (1 - fadeProgress) * maxAlpha;
      const nextAlpha = fadeProgress * maxAlpha;

      const figScale = Math.min(w / 280, 1.55);
      drawCinematicPerformer(w * 0.5, h * 0.42, figScale, t * 1.5, currentScene, currentAlpha);
      if (fadeProgress > 0) {
        drawCinematicPerformer(w * 0.5, h * 0.42, figScale, t * 1.5, nextScene, nextAlpha);
      }

      // Golden / Bioluminescent Floating Motes
      motes.forEach((m) => {
        m.y -= m.vy;
        m.x += m.vx + Math.sin(t + m.phase) * 0.0003;
        if (m.y < -0.02) m.y = 1.02;
        if (m.x < 0) m.x = 1;
        if (m.x > 1) m.x = 0;

        const a = 0.25 + 0.65 * Math.abs(Math.sin(t * 1.2 + m.phase));
        ctx.fillStyle =
          currentScene === 0
            ? `rgba(253, 224, 71, ${a.toFixed(2)})`
            : `rgba(125, 211, 252, ${a.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [clearView]);

  if (Platform.OS !== "web") {
    return <View style={styles.nativeBg} />;
  }

  return (
    <View pointerEvents="none" style={styles.container}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  nativeBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#060814",
    zIndex: 0,
  },
});
