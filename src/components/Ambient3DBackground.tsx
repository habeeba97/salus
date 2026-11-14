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

    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1 + Math.random() * 2.4,
      vy: 0.0004 + Math.random() * 0.0008,
      vx: (Math.random() - 0.5) * 0.0003,
      phase: Math.random() * Math.PI * 2,
    }));

    const drawSomaticFigure = (
      cx: number,
      cy: number,
      scale: number,
      poseCycle: number,
      sceneIndex: number,
      alpha: number
    ) => {
      if (alpha <= 0.01) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha;

      const auraGrad = ctx.createRadialGradient(0, -10, 10, 0, -10, 170);
      if (sceneIndex === 0) {
        auraGrad.addColorStop(0, "rgba(56, 189, 248, 0.28)");
        auraGrad.addColorStop(0.5, "rgba(129, 140, 248, 0.12)");
        auraGrad.addColorStop(1, "transparent");
      } else if (sceneIndex === 1) {
        auraGrad.addColorStop(0, "rgba(52, 211, 153, 0.28)");
        auraGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.12)");
        auraGrad.addColorStop(1, "transparent");
      } else {
        auraGrad.addColorStop(0, "rgba(244, 114, 182, 0.28)");
        auraGrad.addColorStop(0.5, "rgba(192, 132, 252, 0.12)");
        auraGrad.addColorStop(1, "transparent");
      }
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, -10, 170, 0, Math.PI * 2);
      ctx.fill();

      const strokeCol =
        sceneIndex === 0
          ? "rgba(125, 211, 252, 0.65)"
          : sceneIndex === 1
          ? "rgba(110, 231, 183, 0.65)"
          : "rgba(249, 168, 212, 0.65)";

      ctx.strokeStyle = strokeCol;
      ctx.fillStyle = strokeCol;
      ctx.shadowColor = strokeCol;
      ctx.shadowBlur = 18;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const breath = Math.sin(poseCycle);
      const sway = Math.sin(poseCycle * 0.5);

      if (sceneIndex === 0) {
        const armRaise = -1.35 + breath * 0.45;
        const torsoLean = sway * 0.12;

        ctx.lineWidth = 11;
        ctx.beginPath();
        ctx.moveTo(-6, 26);
        ctx.lineTo(-26, 82);
        ctx.lineTo(-30, 132);
        ctx.moveTo(6, 26);
        ctx.lineTo(26, 82);
        ctx.lineTo(30, 132);
        ctx.stroke();

        ctx.save();
        ctx.rotate(torsoLean);
        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.moveTo(0, 24);
        ctx.lineTo(0, -34);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -54, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(-8, -30);
        ctx.quadraticCurveTo(
          -34,
          -30 + Math.sin(armRaise) * 35,
          -18 + Math.cos(armRaise) * 16,
          -86 - breath * 14
        );
        ctx.moveTo(8, -30);
        ctx.quadraticCurveTo(
          34,
          -30 + Math.sin(armRaise) * 35,
          18 - Math.cos(armRaise) * 16,
          -86 - breath * 14
        );
        ctx.stroke();
        ctx.restore();
      } else if (sceneIndex === 1) {
        const lungeShift = sway * 12;

        ctx.lineWidth = 11;
        ctx.beginPath();
        ctx.moveTo(lungeShift, 26);
        ctx.lineTo(-42 + lungeShift * 0.5, 76);
        ctx.lineTo(-48, 132);
        ctx.moveTo(lungeShift, 26);
        ctx.lineTo(38 + lungeShift * 0.5, 80);
        ctx.lineTo(54, 132);
        ctx.stroke();

        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.moveTo(lungeShift, 24);
        ctx.lineTo(lungeShift * 0.8, -34);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(lungeShift * 0.8, -54, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(lungeShift * 0.8 - 8, -28);
        ctx.quadraticCurveTo(
          lungeShift - 44,
          -34 + breath * 12,
          lungeShift - 82,
          -26 - breath * 10
        );
        ctx.moveTo(lungeShift * 0.8 + 8, -28);
        ctx.quadraticCurveTo(
          lungeShift + 44,
          -34 - breath * 12,
          lungeShift + 82,
          -26 + breath * 10
        );
        ctx.stroke();
      } else {
        ctx.lineWidth = 11;
        ctx.beginPath();
        ctx.moveTo(0, 32);
        ctx.quadraticCurveTo(-52, 34, -46, 56);
        ctx.quadraticCurveTo(-18, 66, 12, 54);
        ctx.moveTo(0, 32);
        ctx.quadraticCurveTo(52, 34, 46, 56);
        ctx.quadraticCurveTo(18, 66, -12, 54);
        ctx.stroke();

        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.moveTo(0, 30);
        ctx.lineTo(0, -28);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -48, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 8.5;
        ctx.beginPath();
        ctx.moveTo(-8, -22);
        ctx.quadraticCurveTo(-34, 6, -42, 46 - breath * 4);
        ctx.moveTo(8, -22);
        ctx.quadraticCurveTo(34, 6, 42, 46 - breath * 4);
        ctx.stroke();

        const heartRadius = 18 + (breath + 1) * 18;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -6, heartRadius, 0, Math.PI * 2);
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
      t += 0.018;

      const bgGrad = ctx.createLinearGradient(0, 0, w * 0.4, h);
      bgGrad.addColorStop(0, "#060814");
      bgGrad.addColorStop(0.5, "#0D1229");
      bgGrad.addColorStop(1, "#070913");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      for (let band = 0; band < 2; band++) {
        ctx.beginPath();
        const baseY = h * (0.28 + band * 0.34);
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= w; x += 24) {
          const y =
            baseY +
            Math.sin(x * 0.006 + t * 0.7 + band * 2) * 38 +
            Math.cos(x * 0.012 - t * 0.4) * 20;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle =
          band === 0 ? "rgba(56, 189, 248, 0.05)" : "rgba(168, 85, 247, 0.055)";
        ctx.fill();
      }

      const cycleDuration = 9.0;
      const totalCycle = cycleDuration * 3;
      const modT = t % totalCycle;
      const currentScene = Math.floor(modT / cycleDuration);
      const nextScene = (currentScene + 1) % 3;
      const localProgress = (modT % cycleDuration) / cycleDuration;

      const fadeProgress = localProgress > 0.8 ? (localProgress - 0.8) / 0.2 : 0;
      const currentAlpha = (1 - fadeProgress) * 0.65;
      const nextAlpha = fadeProgress * 0.65;

      const figureScale = Math.min(w / 320, 1.35);
      drawSomaticFigure(w * 0.5, h * 0.44, figureScale, t * 1.4, currentScene, currentAlpha);
      if (fadeProgress > 0) {
        drawSomaticFigure(w * 0.5, h * 0.44, figureScale, t * 1.4, nextScene, nextAlpha);
      }

      particles.forEach((p) => {
        p.y -= p.vy;
        p.x += p.vx + Math.sin(t + p.phase) * 0.0002;
        if (p.y < -0.02) p.y = 1.02;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;

        const alpha = 0.2 + 0.5 * Math.abs(Math.sin(t + p.phase));
        ctx.fillStyle = `rgba(165, 180, 252, ${alpha.toFixed(2)})`;
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
