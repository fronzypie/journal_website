export type TimelineMemory = {
  id: string;
  date: string;
  day: string;
  image: string;
  month: string;
  mood: "still" | "clear" | "tender" | "restless" | "bright";
  preview: string;
  tags: string[];
  title: string;
  year: string;
};

export const timelineMemories: TimelineMemory[] = [
  {
    id: "memory-2026-07-17",
    year: "2026",
    month: "July",
    day: "17",
    date: "Jul 17, 2026",
    title: "Morning light through the blinds",
    preview:
      "I kept this one quiet on purpose. The room felt softer than usual, and the day seemed willing to meet me halfway.",
    mood: "still",
    tags: ["morning", "light", "home"],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "memory-2026-07-14",
    year: "2026",
    month: "July",
    day: "14",
    date: "Jul 14, 2026",
    title: "Leaving before the noise returned",
    preview:
      "I stepped away early and noticed how much of the evening was already mine again.",
    mood: "tender",
    tags: ["evening", "reset", "city"],
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "memory-2026-06-28",
    year: "2026",
    month: "June",
    day: "28",
    date: "Jun 28, 2026",
    title: "A clearer path than expected",
    preview:
      "The answer didn’t arrive all at once. It came in fragments, then suddenly the whole shape made sense.",
    mood: "clear",
    tags: ["clarity", "work", "decision"],
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "memory-2026-06-21",
    year: "2026",
    month: "June",
    day: "21",
    date: "Jun 21, 2026",
    title: "A restless list I kept revisiting",
    preview:
      "Some thoughts circle until they become useful. Others circle because they want to be seen first.",
    mood: "restless",
    tags: ["list", "thinking", "night"],
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "memory-2025-12-31",
    year: "2025",
    month: "December",
    day: "31",
    date: "Dec 31, 2025",
    title: "A soft ending to a loud year",
    preview:
      "I didn’t need a grand conclusion. I needed a moment to sit still and let the year finish speaking.",
    mood: "bright",
    tags: ["year-end", "reflection", "gratitude"],
    image:
      "https://images.unsplash.com/photo-1515442261605-65987783cb6f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "memory-2025-12-18",
    year: "2025",
    month: "December",
    day: "18",
    date: "Dec 18, 2025",
    title: "The snow outside made everything slower",
    preview:
      "Even the smallest decision felt gentler while the city held its breath under the weather.",
    mood: "still",
    tags: ["winter", "snow", "home"],
    image:
      "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "memory-2025-10-09",
    year: "2025",
    month: "October",
    day: "09",
    date: "Oct 9, 2025",
    title: "What the week taught me quietly",
    preview:
      "The lesson was never loud. It was more like a hand on the shoulder, asking me to slow down.",
    mood: "clear",
    tags: ["lesson", "week", "slow"],
    image:
      "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "memory-2025-08-23",
    year: "2025",
    month: "August",
    day: "23",
    date: "Aug 23, 2025",
    title: "A warm afternoon at the edge of summer",
    preview:
      "Everything felt amber and temporary. I wanted to keep the exact texture of that feeling.",
    mood: "bright",
    tags: ["summer", "afternoon", "memory"],
    image:
      "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "memory-2025-04-12",
    year: "2025",
    month: "April",
    day: "12",
    date: "Apr 12, 2025",
    title: "The first quiet walk of spring",
    preview:
      "The trees had only just started keeping promises, and I could feel my shoulders unclench.",
    mood: "tender",
    tags: ["spring", "walk", "outdoors"],
    image:
      "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "memory-2024-11-03",
    year: "2024",
    month: "November",
    day: "03",
    date: "Nov 3, 2024",
    title: "A note I almost didn’t keep",
    preview:
      "I nearly dismissed it as nothing, which is usually when a memory is trying hardest to stay.",
    mood: "restless",
    tags: ["note", "archive", "memory"],
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "memory-2024-02-19",
    year: "2024",
    month: "February",
    day: "19",
    date: "Feb 19, 2024",
    title: "When the room felt like a promise",
    preview:
      "There was space enough to hear myself think, and that felt like the first honest luxury.",
    mood: "clear",
    tags: ["room", "quiet", "promise"],
    image:
      "https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=900&q=80",
  },
];

export const timelineMoodOptions = [
  { value: "all", label: "All moods" },
  { value: "still", label: "Still" },
  { value: "clear", label: "Clear" },
  { value: "tender", label: "Tender" },
  { value: "restless", label: "Restless" },
  { value: "bright", label: "Bright" },
] as const;
