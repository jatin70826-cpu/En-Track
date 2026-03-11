import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

/**
 * ScrollGeometricShapes — light-mode-only decorative geometric shapes
 * that appear/animate as the user scrolls down the page.
 * Includes translucent triangles, hexagons, circles, and diamond shapes
 * with mint-green/indigo/sky-blue tones.
 */

interface Shape {
  id: number;
  type: 'triangle' | 'hexagon' | 'circle' | 'diamond' | 'ring' | 'cross';
  x: string;
  y: string;
  size: number;
  rotation: number;
  color: string;
  opacity: number;
  parallaxFactor: number;
}

const SHAPES: Shape[] = [
  { id: 1, type: 'triangle', x: '5%', y: '12%', size: 40, rotation: 15, color: '#3B82F6', opacity: 0.12, parallaxFactor: 0.3 },
  { id: 2, type: 'hexagon', x: '88%', y: '8%', size: 50, rotation: 30, color: '#6366F1', opacity: 0.1, parallaxFactor: 0.2 },
  { id: 3, type: 'circle', x: '92%', y: '25%', size: 28, rotation: 0, color: '#38BDF8', opacity: 0.15, parallaxFactor: 0.4 },
  { id: 4, type: 'diamond', x: '3%', y: '35%', size: 35, rotation: 0, color: '#6366F1', opacity: 0.08, parallaxFactor: 0.25 },
  { id: 5, type: 'ring', x: '95%', y: '45%', size: 55, rotation: 0, color: '#3B82F6', opacity: 0.07, parallaxFactor: 0.15 },
  { id: 6, type: 'triangle', x: '90%', y: '60%', size: 32, rotation: -20, color: '#38BDF8', opacity: 0.1, parallaxFactor: 0.35 },
  { id: 7, type: 'cross', x: '7%', y: '55%', size: 24, rotation: 45, color: '#3B82F6', opacity: 0.12, parallaxFactor: 0.3 },
  { id: 8, type: 'hexagon', x: '4%', y: '72%', size: 45, rotation: -15, color: '#38BDF8', opacity: 0.08, parallaxFactor: 0.2 },
  { id: 9, type: 'circle', x: '93%', y: '78%', size: 22, rotation: 0, color: '#6366F1', opacity: 0.14, parallaxFactor: 0.4 },
  { id: 10, type: 'diamond', x: '88%', y: '90%', size: 30, rotation: 15, color: '#3B82F6', opacity: 0.1, parallaxFactor: 0.25 },
  { id: 11, type: 'triangle', x: '8%', y: '88%', size: 36, rotation: 60, color: '#6366F1', opacity: 0.09, parallaxFactor: 0.3 },
  { id: 12, type: 'ring', x: '6%', y: '48%', size: 38, rotation: 0, color: '#38BDF8', opacity: 0.06, parallaxFactor: 0.15 },
];

function ShapeSVG({ type, size, color, rotation }: { type: Shape['type']; size: number; color: string; rotation: number }) {
  const transform = `rotate(${rotation} ${size / 2} ${size / 2})`;

  switch (type) {
    case 'triangle': {
      const h = size * 0.866;
      return (
        <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
          <polygon
            points={`${size / 2},0 ${size},${h} 0,${h}`}
            fill={color}
            transform={`rotate(${rotation} ${size / 2} ${h / 2})`}
          />
        </svg>
      );
    }
    case 'hexagon': {
      const cx = size / 2, cy = size / 2, r = size / 2;
      const points = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
      }).join(' ');
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <polygon points={points} fill={color} transform={transform} />
        </svg>
      );
    }
    case 'circle':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 1} fill={color} />
        </svg>
      );
    case 'diamond':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <polygon
            points={`${size / 2},0 ${size},${size / 2} ${size / 2},${size} 0,${size / 2}`}
            fill={color}
            transform={transform}
          />
        </svg>
      );
    case 'ring':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill="none" stroke={color} strokeWidth={2} />
        </svg>
      );
    case 'cross': {
      const arm = size * 0.3;
      const gap = (size - arm) / 2;
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <g transform={transform}>
            <rect x={gap} y={0} width={arm} height={size} fill={color} rx={arm / 4} />
            <rect x={0} y={gap} width={size} height={arm} fill={color} rx={arm / 4} />
          </g>
        </svg>
      );
    }
    default:
      return null;
  }
}

function ScrollShape({ shape }: { shape: Shape }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -200 * shape.parallaxFactor]
  );

  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 360 * shape.parallaxFactor]
  );

  return (
    <motion.div
      ref={ref}
      className="absolute pointer-events-none"
      style={{
        left: shape.x,
        top: shape.y,
        opacity: shape.opacity,
        y,
        rotate,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: shape.opacity, scale: 1 }}
      transition={{ duration: 1.2, delay: shape.id * 0.08, ease: 'easeOut' }}
    >
      <ShapeSVG
        type={shape.type}
        size={shape.size}
        color={shape.color}
        rotation={shape.rotation}
      />
    </motion.div>
  );
}

export function ScrollGeometricShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] dark:hidden overflow-hidden">
      {SHAPES.map((shape) => (
        <ScrollShape key={shape.id} shape={shape} />
      ))}
    </div>
  );
}