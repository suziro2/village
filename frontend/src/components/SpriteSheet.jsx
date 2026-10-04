import React, { useEffect, useState } from "react";

export default function SpriteSheet({
  src,
  fallback,
  alt = "",
  animation = "idle",
  frames = 4,
  fps = 12,
  className = "",
}) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (animation === "idle" || animation === "hit" || animation === "defeat") {
      setFrame(animation === "hit" ? Math.min(2, frames - 1) : animation === "defeat" ? frames - 1 : 0);
      return undefined;
    }
    let current = 0;
    const timer = setInterval(() => {
      current = (current + 1) % frames;
      setFrame(current);
    }, Math.max(40, 1000 / fps));
    return () => clearInterval(timer);
  }, [animation, frames, fps]);

  if (!src) return <img src={fallback} alt={alt} className={className} />;

  return (
    <div
      className={`vl-sprite-sheet ${className}`}
      role="img"
      aria-label={alt}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: `${frames * 100}% 100%`,
        backgroundPosition: `${frames === 1 ? 0 : (frame / (frames - 1)) * 100}% 50%`,
      }}
    />
  );
}
