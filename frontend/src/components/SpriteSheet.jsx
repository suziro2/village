import React, { useEffect, useState } from "react";

const ATTACK_FRAMES = 6;

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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFrame(0);
    setFailed(false);
    if (!src) return undefined;
    const probe = new Image();
    probe.onload = () => setFailed(false);
    probe.onerror = () => setFailed(true);
    probe.src = src;
    return () => { probe.onload = null; probe.onerror = null; };
  }, [src]);

  useEffect(() => {
    setFrame(0);

    if (animation === "idle") return undefined;
    if (animation === "hit") {
      setFrame(Math.min(2, frames - 1));
      return undefined;
    }
    if (animation === "defeat") {
      setFrame(frames - 1);
      return undefined;
    }

    const sequence =
      animation === "vl-attack-right" || animation === "attack"
        ? [0, 1, 2, 3, Math.min(2, frames - 1), 3]
        : animation === "vl-skill" || animation === "skill"
          ? [0, 1, 2, 3, 2, 1]
          : Array.from({ length: frames }, (_, i) => i);

    let index = 0;
    setFrame(sequence[0]);
    const timer = setInterval(() => {
      index = (index + 1) % sequence.length;
      setFrame(sequence[index]);
    }, Math.max(45, 1000 / fps));

    return () => clearInterval(timer);
  }, [animation, frames, fps]);

  if (!src || failed) {
    return (
      <img
        src={fallback}
        alt={alt}
        className={`vl-combat-character ${animation === "vl-attack-right" || animation === "attack" ? "vl-character-attacking" : ""} ${className}`}
      />
    );
  }

  const isAttack = animation === "vl-attack-right" || animation === "attack";
  const isSkill = animation === "vl-skill" || animation === "skill";

  return (
    <div
      className={`vl-sprite-sheet ${isAttack ? "vl-sprite-attacking" : ""} ${isSkill ? "vl-sprite-skilling" : ""} ${className}`}
      role="img"
      aria-label={alt}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: `${frames * 100}% 100%`,
        backgroundPosition: `${frames === 1 ? 0 : (frame / (frames - 1)) * 100}% 50%`,
      }}
    >
      {isAttack && <span className="vl-slash-effect" aria-hidden />}
    </div>
  );
}
