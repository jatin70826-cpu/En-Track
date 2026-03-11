import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

/**
 * DarkModeAmbient — replaces MatrixRain per spec:
 * "Minimalist tracking-themed elements like glowing micro-dots
 *  and thin, low-opacity vector paths representing data movement."
 *  NO digital rain / Matrix pattern.
 */
export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (theme !== 'dark' && resolvedTheme !== 'dark') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Micro-dots: floating particles that drift slowly
    interface Dot {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      pulseOffset: number;
    }

    const DOT_COUNT = Math.min(80, Math.floor((width * height) / 18000));
    const palette = ['#60A5FA', '#38BDF8', '#818CF8', '#93C5FD', '#7DD3FC'];

    const dots: Dot[] = Array.from({ length: DOT_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.12,
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: 0.15 + Math.random() * 0.35,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    let animationId: number;
    let t = 0;

    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Draw thin connecting lines between nearby dots
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const lineAlpha = (1 - dist / 160) * 0.08;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw glowing micro-dots
      for (const dot of dots) {
        const pulse = Math.sin(t * 2 + dot.pulseOffset) * 0.15 + 0.85;
        const alpha = dot.alpha * pulse;

        // Outer glow
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = dot.color.replace(')', `, ${alpha * 0.15})`).replace('rgb', 'rgba').replace('#', '');
        // Use hex to rgba manually
        const r = parseInt(dot.color.slice(1, 3), 16);
        const g = parseInt(dot.color.slice(3, 5), 16);
        const b = parseInt(dot.color.slice(5, 7), 16);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.12})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();

        // Move
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Wrap around
        if (dot.x < -10) dot.x = width + 10;
        if (dot.x > width + 10) dot.x = -10;
        if (dot.y < -10) dot.y = height + 10;
        if (dot.y > height + 10) dot.y = -10;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [theme, resolvedTheme, mounted]);

  if (!mounted) return null;
  if (theme !== 'dark' && resolvedTheme !== 'dark') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-70"
    />
  );
}