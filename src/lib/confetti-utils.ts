import confetti from "canvas-confetti";

export function triggerSmallConfetti(origin?: { x: number; y: number }) {
  const options = {
    particleCount: 50,
    spread: 60,
    origin: origin || { y: 0.6 },
    colors: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#e0f2fe"],
    disableForReducedMotion: true,
  };

  confetti(options);
}

export function triggerBigConfetti() {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

export function triggerStreakConfetti() {
  // A nice burst for hitting a streak
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

export function triggerPhasedConfetti(
  count: number,
  origin?: { x: number; y: number },
) {
  // Base config
  const defaultOrigin = origin || { y: 0.6 };
  const baseParticleCount = 40;
  const baseSpread = 50;

  // Scale up to 100 counts
  // Cap the multiplier at 3x (at 100 count)
  const intensity = Math.min(count, 100) / 100; // 0.0 ~ 1.0
  const countMultiplier = 1 + intensity * 2; // 1.0 ~ 3.0
  const spreadMultiplier = 1 + intensity * 1.5; // 1.0 ~ 2.5
  const startVelocityMultiplier = 1 + intensity * 0.5; // 1.0 ~ 1.5

  const particleCount = Math.floor(baseParticleCount * countMultiplier);
  const spread = Math.floor(baseSpread * spreadMultiplier);
  const startVelocity = 30 * startVelocityMultiplier;

  // Determine colors based on progress (0-100)
  let colors: string[];
  if (count < 20) {
    // Stage 1: Blue/Cool (Start)
    colors = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#e0f2fe"];
  } else if (count < 40) {
    // Stage 2: Cyan/Teal (Getting started)
    colors = ["#0891b2", "#06b6d4", "#22d3ee", "#67e8f9", "#cffafe"];
  } else if (count < 60) {
    // Stage 3: Green/Lime (Building momentum)
    colors = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#d1fae5"];
  } else if (count < 80) {
    // Stage 4: Yellow/Orange (High activity)
    colors = ["#d97706", "#f59e0b", "#fbbf24", "#fcd34d", "#fef3c7"];
  } else {
    // Stage 5: Red/Purple (On fire!)
    colors = ["#dc2626", "#ef4444", "#f87171", "#db2777", "#f472b6"];
  }

  // 20% chance for special "Gold" confetti
  const isSpecial = Math.random() < 0.2;

  if (isSpecial) {
    // Special Gold Effect
    confetti({
      particleCount: particleCount + 50,
      spread: spread + 20,
      startVelocity: startVelocity + 10,
      origin: defaultOrigin,
      colors: ["#FFD700", "#FFA500", "#FFFF00", "#F0E68C"], // Gold/Yellow shades
      shapes: ["star"],
      disableForReducedMotion: true,
      zIndex: 100,
    });
    // Add some glitter (circles)
    confetti({
      particleCount: 30,
      spread: spread,
      startVelocity: startVelocity,
      origin: defaultOrigin,
      colors: ["#FFFFFF", "#FFD700"],
      shapes: ["circle"],
      scalar: 0.5,
      disableForReducedMotion: true,
      zIndex: 100,
    });
  } else {
    // Normal Effect (scaling with color grading)
    confetti({
      particleCount,
      spread,
      startVelocity,
      origin: defaultOrigin,
      colors: colors,
      disableForReducedMotion: true,
    });
  }
}
