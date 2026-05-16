import React from 'react';

type Side = 'left' | 'right';
type Variant = 'rebung' | 'insang' | 'kelawit';
type CornerPos = 'tl' | 'tr' | 'bl' | 'br';

// =============================================================
// Padi stalk — symmetric flanking ornament for masthead
// =============================================================
export const PadiStalk: React.FC<{ side?: Side; size?: number; opacity?: number }> = ({
  side = 'left',
  size = 120,
  opacity = 1,
}) => {
  const flip = side === 'right' ? 'scale(-1,1) translate(-120,0)' : '';
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 120 200" style={{ opacity }}>
      <g transform={flip} fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M 90 195 Q 78 150 70 110 Q 62 70 48 25" strokeWidth="1.6" />
        <path d="M 90 195 Q 96 150 100 100 Q 102 60 96 20" strokeWidth="1.4" />
        <path d="M 90 195 Q 70 160 50 130 Q 30 100 22 60" strokeWidth="1.4" />
        <path d="M 70 110 Q 50 100 30 110 Q 48 112 70 110 Z" strokeWidth="1" fill="currentColor" fillOpacity="0.18" />
        <path d="M 75 75 Q 95 70 110 80 Q 95 78 75 75 Z" strokeWidth="1" fill="currentColor" fillOpacity="0.18" />
        <path d="M 60 50 Q 40 40 25 50 Q 45 50 60 50 Z" strokeWidth="1" fill="currentColor" fillOpacity="0.18" />
        {Array.from({ length: 9 }).map((_, i) => {
          const t = i / 9;
          const x = 48 + 28 * Math.sin(t * 3) - t * 18;
          const y = 25 + t * 30;
          const angle = -30 + t * 15;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${angle})`}>
              <ellipse cx="0" cy="0" rx="3.2" ry="1.6" fill="currentColor" fillOpacity="0.85" />
              <line x1="3" y1="0" x2="9" y2="-1" strokeWidth="0.7" />
            </g>
          );
        })}
        {Array.from({ length: 7 }).map((_, i) => {
          const t = i / 7;
          const x = 96 + 10 * Math.sin(t * 3);
          const y = 20 + t * 35;
          return (
            <g key={'r' + i} transform={`translate(${x} ${y}) rotate(${15 + t * 10})`}>
              <ellipse cx="0" cy="0" rx="2.8" ry="1.4" fill="currentColor" fillOpacity="0.8" />
              <line x1="3" y1="0" x2="8" y2="-1" strokeWidth="0.7" />
            </g>
          );
        })}
        {Array.from({ length: 7 }).map((_, i) => {
          const t = i / 7;
          const x = 22 + 8 * Math.sin(t * 3) + t * 5;
          const y = 60 - t * 30;
          return (
            <g key={'l' + i} transform={`translate(${x} ${y}) rotate(${-50 + t * 10})`}>
              <ellipse cx="0" cy="0" rx="2.8" ry="1.4" fill="currentColor" fillOpacity="0.8" />
              <line x1="3" y1="0" x2="8" y2="-1" strokeWidth="0.7" />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

// =============================================================
// Pucuk Rebung — alternating triangles (Melayu Sambas motif)
// =============================================================
export const PucukRebung: React.FC<{ width?: number; height?: number; count?: number }> = ({
  width = 400,
  height = 28,
  count = 14,
}) => {
  const w = width / count;
  const half = w / 2;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {Array.from({ length: count }).map((_, i) => {
        const cx = i * w + half;
        return (
          <g key={i} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
            <path d={`M ${cx - half + 2} ${height - 2} L ${cx} 3 L ${cx + half - 2} ${height - 2} Z`} />
            <path d={`M ${cx - half * 0.55} ${height - 4} L ${cx} ${height * 0.35} L ${cx + half * 0.55} ${height - 4}`} />
            <circle cx={cx} cy={height * 0.55} r="0.9" fill="currentColor" />
          </g>
        );
      })}
      <line x1="0" y1={height - 1} x2={width} y2={height - 1} stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
};

// =============================================================
// Corak Insang — Sambas weaving zigzag chevron
// =============================================================
export const CorakInsang: React.FC<{ width?: number; height?: number; count?: number }> = ({
  width = 400,
  height = 22,
  count = 20,
}) => {
  const w = width / count;
  const topPath = (() => {
    let d = `M 0 ${height - 2}`;
    for (let i = 0; i < count; i++) {
      d += ` L ${i * w + w / 2} 2 L ${(i + 1) * w} ${height - 2}`;
    }
    return d;
  })();
  const midPath = (() => {
    let d = `M 0 ${height / 2 + 4}`;
    for (let i = 0; i < count; i++) {
      d += ` L ${i * w + w / 2} ${height / 2 - 4} L ${(i + 1) * w} ${height / 2 + 4}`;
    }
    return d;
  })();
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d={topPath} />
        <path d={midPath} strokeDasharray="1 2" />
        {Array.from({ length: count }).map((_, i) => (
          <circle key={i} cx={i * w + w / 2} cy={height - 5} r="0.9" fill="currentColor" />
        ))}
      </g>
    </svg>
  );
};

// =============================================================
// Kelawit Dayak — spiral S-curve hook
// =============================================================
export const KelawitDayak: React.FC<{ size?: number; mirror?: boolean }> = ({
  size = 64,
  mirror = false,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    style={{ transform: mirror ? 'scaleX(-1)' : 'none' }}
  >
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M 8 56 Q 8 38 22 32 Q 36 26 36 14 Q 36 6 28 6 Q 22 6 22 12 Q 22 16 26 16" />
      <path d="M 22 32 Q 14 32 14 42 Q 14 48 20 48 Q 24 48 24 44 Q 24 42 22 42" />
      <circle cx="26" cy="16" r="1.4" fill="currentColor" />
      <circle cx="22" cy="42" r="1.1" fill="currentColor" />
      <path d="M 30 30 Q 40 30 44 38 Q 48 46 56 46 Q 60 46 60 42" strokeWidth="1.1" />
      <circle cx="60" cy="42" r="1.1" fill="currentColor" />
      <circle cx="44" cy="38" r="0.9" fill="currentColor" />
    </g>
  </svg>
);

// =============================================================
// Tampuk Manggis — rosette divider (Dayak/Melayu)
// =============================================================
export const TampukDivider: React.FC<{ width?: number; color?: string }> = ({
  width = 200,
  color = 'currentColor',
}) => (
  <svg width={width} height="28" viewBox="0 0 200 28">
    <g fill="none" stroke={color} strokeWidth="1" strokeLinecap="round">
      <line x1="0" y1="14" x2="78" y2="14" />
      <line x1="122" y1="14" x2="200" y2="14" />
      <line x1="0" y1="11" x2="60" y2="11" strokeDasharray="1 3" strokeWidth="0.6" />
      <line x1="0" y1="17" x2="60" y2="17" strokeDasharray="1 3" strokeWidth="0.6" />
      <line x1="140" y1="11" x2="200" y2="11" strokeDasharray="1 3" strokeWidth="0.6" />
      <line x1="140" y1="17" x2="200" y2="17" strokeDasharray="1 3" strokeWidth="0.6" />
      <g transform="translate(100 14)">
        <circle cx="0" cy="0" r="9" />
        <circle cx="0" cy="0" r="4" />
        <circle cx="0" cy="0" r="1.5" fill={color} stroke="none" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return (
            <line
              key={i}
              x1={Math.cos(a) * 4}
              y1={Math.sin(a) * 4}
              x2={Math.cos(a) * 9}
              y2={Math.sin(a) * 9}
              strokeWidth="0.8"
            />
          );
        })}
      </g>
      <polygon points="85,14 92,10 92,18" fill={color} stroke="none" />
      <polygon points="115,14 108,10 108,18" fill={color} stroke="none" />
    </g>
  </svg>
);

// =============================================================
// Phase illustration — stages of padi growth
// =============================================================
type PhaseId = 'semai' | 'vegetatif' | 'bunting' | 'generatif';

export const PhaseIllustration: React.FC<{ phase: PhaseId; size?: number }> = ({
  phase,
  size = 56,
}) => {
  const stalks: Record<PhaseId, React.ReactNode> = {
    semai: (
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <line x1="32" y1="50" x2="32" y2="14" />
        <path d="M 32 28 Q 22 28 18 18" />
        <path d="M 32 30 Q 42 30 46 20" />
        <path d="M 32 22 Q 26 18 22 10" />
        <line x1="20" y1="50" x2="44" y2="50" strokeWidth="2" />
        <path d="M 18 50 Q 24 53 32 53 Q 40 53 46 50" strokeDasharray="1 1.5" />
      </g>
    ),
    vegetatif: (
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M 32 50 L 32 10" />
        <path d="M 32 50 Q 22 38 14 28" />
        <path d="M 32 50 Q 42 38 50 28" />
        <path d="M 32 38 Q 24 32 18 22" />
        <path d="M 32 38 Q 40 32 46 22" />
        <line x1="14" y1="52" x2="50" y2="52" strokeWidth="2" />
      </g>
    ),
    bunting: (
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M 32 52 L 32 8" />
        <path d="M 32 30 Q 22 22 14 14" />
        <path d="M 32 30 Q 42 22 50 14" />
        <ellipse cx="32" cy="14" rx="5" ry="9" fill="currentColor" fillOpacity="0.25" />
        <line x1="14" y1="54" x2="50" y2="54" strokeWidth="2" />
      </g>
    ),
    generatif: (
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M 32 54 Q 32 30 26 8" />
        <path d="M 26 36 Q 18 30 12 22" />
        <path d="M 28 28 Q 38 22 46 12" />
        {Array.from({ length: 7 }).map((_, i) => {
          const t = i / 7;
          const angle = -45 + t * 20;
          const x = 26 - t * 8 + Math.sin(t * 3) * 3;
          const y = 8 + t * 22;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${angle})`}>
              <ellipse cx="0" cy="0" rx="2.4" ry="1.1" fill="currentColor" fillOpacity="0.9" />
              <line x1="2" y1="0" x2="6" y2="-1" strokeWidth="0.6" />
            </g>
          );
        })}
        <line x1="14" y1="56" x2="50" y2="56" strokeWidth="2" />
      </g>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      {stalks[phase] || stalks.vegetatif}
    </svg>
  );
};

// =============================================================
// Batik background — subtle repeated motif pattern
// =============================================================
export const BatikBackground: React.FC<{ variant?: Variant; opacity?: number }> = ({
  variant = 'rebung',
  opacity = 0.06,
}) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    opacity,
    pointerEvents: 'none',
  };

  if (variant === 'rebung') {
    return (
      <svg width="100%" height="100%" style={style}>
        <defs>
          <pattern id="bg-rebung" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 0 38 L 20 12 L 40 38 M 8 38 L 20 22 L 32 38"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
            />
            <circle cx="20" cy="32" r="0.8" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-rebung)" />
      </svg>
    );
  }
  if (variant === 'insang') {
    return (
      <svg width="100%" height="100%" style={style}>
        <defs>
          <pattern id="bg-insang" width="36" height="36" patternUnits="userSpaceOnUse">
            <path
              d="M 0 30 L 18 6 L 36 30 M 0 18 L 18 30 L 36 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-insang)" />
      </svg>
    );
  }
  return (
    <svg width="100%" height="100%" style={style}>
      <defs>
        <pattern id="bg-kelawit" width="48" height="48" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.7">
            <path d="M 8 40 Q 8 28 16 24 Q 24 20 24 12 Q 24 8 20 8" />
            <path d="M 40 8 Q 40 20 32 24 Q 24 28 24 36 Q 24 40 28 40" />
            <circle cx="20" cy="8" r="1" fill="currentColor" />
            <circle cx="28" cy="40" r="1" fill="currentColor" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg-kelawit)" />
    </svg>
  );
};

// =============================================================
// Corner hook — small kelawit ornament for card corners
// =============================================================
export const CornerHook: React.FC<{ size?: number; position?: CornerPos }> = ({
  size = 28,
  position = 'tl',
}) => {
  const transforms: Record<CornerPos, string> = {
    tl: '',
    tr: 'scale(-1,1) translate(-28,0)',
    bl: 'scale(1,-1) translate(0,-28)',
    br: 'scale(-1,-1) translate(-28,-28)',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 28 28">
      <g
        transform={transforms[position]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      >
        <path d="M 2 14 L 2 6 Q 2 2 6 2 L 14 2" />
        <path d="M 6 10 L 6 6 L 10 6" />
        <circle cx="10" cy="10" r="1.1" fill="currentColor" />
      </g>
    </svg>
  );
};
