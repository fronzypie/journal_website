export const motionEase = [0.22, 1, 0.36, 1] as const;

export const motionDurations = {
  fast: 0.16,
  base: 0.24,
  slow: 0.52,
  reveal: 0.65,
} as const;

export const viewportOnce = {
  once: true,
  margin: "-72px 0px -72px 0px",
} as const;

export function getRevealTransition(
  reducedMotion: boolean,
  delay = 0,
  duration = motionDurations.reveal,
) {
  if (reducedMotion) {
    return { duration: 0, delay: 0 };
  }

  return { delay, duration, ease: motionEase };
}

export function getRevealState(reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      hidden: { opacity: 1, y: 0 },
      visible: { opacity: 1, y: 0 },
    };
  }

  return {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  };
}
