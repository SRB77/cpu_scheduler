import { useEffect, useRef } from "react";
import { cn } from "../utils/cn";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  ease?: number;
  color?: string;
  refresh?: boolean;
}

interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const hexInt = parseInt(hex, 16);
  return [(hexInt >> 16) & 255, (hexInt >> 8) & 255, hexInt & 255];
}

export default function Particles({
  className = "",
  quantity = 100,
  ease = 50,
  color = "#ffffff",
  refresh = false,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const circlesRef = useRef<Circle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const canvasSizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    contextRef.current = ctx;

    const dpr = window.devicePixelRatio || 1;
    const rgb = hexToRgb(color);

    function createCircle(): Circle {
      return {
        x: Math.floor(Math.random() * canvasSizeRef.current.w),
        y: Math.floor(Math.random() * canvasSizeRef.current.h),
        translateX: 0,
        translateY: 0,
        size: Math.floor(Math.random() * 2) + 0.1,
        alpha: 0,
        targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
        dx: (Math.random() - 0.5) * 0.2,
        dy: (Math.random() - 0.5) * 0.2,
        magnetism: 0.1 + Math.random() * 4,
      };
    }

    function drawCircle(circle: Circle, update = false) {
      if (!ctx) return;
      ctx.translate(circle.translateX, circle.translateY);
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${rgb.join(", ")}, ${circle.alpha})`;
      ctx.fill();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!update) {
        circlesRef.current.push(circle);
      }
    }

    function initParticles() {
      circlesRef.current = [];
      for (let i = 0; i < quantity; i++) {
        drawCircle(createCircle());
      }
    }

    function resizeCanvas() {
      if (!canvas || !container || !ctx) return;
      canvasSizeRef.current.w = container.offsetWidth;
      canvasSizeRef.current.h = container.offsetHeight;
      canvas.width = canvasSizeRef.current.w * dpr;
      canvas.height = canvasSizeRef.current.h * dpr;
      canvas.style.width = `${canvasSizeRef.current.w}px`;
      canvas.style.height = `${canvasSizeRef.current.h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      circlesRef.current = [];
      initParticles();
    }

    function animate() {
      if (!ctx) return;
      const { w, h } = canvasSizeRef.current;
      ctx.clearRect(0, 0, w, h);

      const circles = circlesRef.current;
      for (let i = circles.length - 1; i >= 0; i--) {
        const c = circles[i];

        // Bounce off edges
        if (
          c.x + c.translateX - c.size < 0 ||
          c.x + c.translateX + c.size > w
        ) {
          c.dx *= -1;
        }
        if (
          c.y + c.translateY - c.size < 0 ||
          c.y + c.translateY + c.size > h
        ) {
          c.dy *= -1;
        }

        c.translateX += c.dx + (mouseRef.current.x / (ease * 10)) * c.magnetism;
        c.translateY += c.dy + (mouseRef.current.y / (ease * 10)) * c.magnetism;

        if (c.alpha < c.targetAlpha) {
          c.alpha = Math.min(c.alpha + 0.02, c.targetAlpha);
        }

        drawCircle({ ...c }, true);

        // Off-screen → replace
        if (
          c.x + c.translateX < -c.size ||
          c.x + c.translateX > w + c.size ||
          c.y + c.translateY < -c.size ||
          c.y + c.translateY > h + c.size
        ) {
          circles.splice(i, 1);
          drawCircle(createCircle());
        }
      }

      rafRef.current = window.requestAnimationFrame(animate);
    }

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const { w, h } = canvasSizeRef.current;
      const x = e.clientX - rect.left - w / 2;
      const y = e.clientY - rect.top - h / 2;
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouseRef.current = { x, y };
      }
    }

    resizeCanvas();
    animate();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [color, refresh, quantity, ease]);

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
