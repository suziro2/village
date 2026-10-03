import React from "react";

export const Panel = ({ className = "", children, ...p }) => (
  <div
    className={`relative rounded-2xl border border-amber-500/25 bg-slate-900/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${className}`}
    {...p}
  >
    {children}
  </div>
);

export const Bar = ({ value, max, color = "#10b981", className = "", showText = false, label }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`relative h-3.5 w-full rounded-full overflow-hidden bg-slate-950/80 border border-black/50 ${className}`}>
      <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}99` }} />
      {showText && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/90 drop-shadow">
          {label || `${Math.max(0, Math.round(value))}/${max}`}
        </span>
      )}
    </div>
  );
};

export const GoldButton = ({ className = "", children, variant = "gold", ...p }) => {
  const variants = {
    gold: "vl-btn-gold",
    ghost: "vl-btn-ghost",
    danger: "vl-btn-danger",
    blue: "vl-btn-blue",
  };
  return (
    <button className={`vl-btn ${variants[variant]} ${className}`} {...p}>
      {children}
    </button>
  );
};

export const Stars = ({ count = 0, size = 14 }) => (
  <span className="inline-flex gap-0.5">
    {[1, 2, 3].map((i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= count ? "#f59e0b" : "none"} stroke={i <= count ? "#fcd34d" : "#475569"} strokeWidth="2">
        <polygon points="12 2 15 8.5 22 9.3 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9.3 9 8.5" />
      </svg>
    ))}
  </span>
);
