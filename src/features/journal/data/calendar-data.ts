import type { JournalEntryMood } from "@/types/journal";

export type CalendarEntry = {
  body: string;
  date: string;
  id: string;
  image: string;
  mood: JournalEntryMood;
  preview: string;
  title: string;
};

export const calendarEntries: CalendarEntry[] = [
  {
    id: "calendar-2026-07-17-a",
    date: "2026-07-17",
    title: "A quieter kind of ambition",
    mood: "clear",
    preview:
      "Not everything important arrived loudly today. Some of it moved like weather, almost too gently to name.",
    body:
      "I kept returning to the same question until it felt less like pressure and more like direction. The day never became dramatic, which was exactly why it felt trustworthy.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2026-07-17-b",
    date: "2026-07-17",
    title: "The second page stayed open",
    mood: "still",
    preview:
      "A small pocket of quiet held long enough for me to hear the sentence underneath the sentence.",
    body:
      "I did not rush to complete the thought. I let it stay unfinished until it could carry its own weight.",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2026-07-14-a",
    date: "2026-07-14",
    title: "After the rain",
    mood: "still",
    preview:
      "The city looked rinsed clean tonight, and for a few minutes my thoughts did too.",
    body:
      "The sidewalks had that reflective sheen that makes everything feel newly arranged. I walked slowly enough to notice the shift.",
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2026-07-09-a",
    date: "2026-07-09",
    title: "A soft return to routine",
    mood: "bright",
    preview:
      "The rhythm came back without needing to be forced, which felt like a small gift.",
    body:
      "The useful parts of the day arrived in sequence: water, light, work, pause, and a little gratitude for all of it.",
    image:
      "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2026-06-28-a",
    date: "2026-06-28",
    title: "A clearer path than expected",
    mood: "clear",
    preview:
      "The answer didn’t arrive all at once. It came in fragments, then suddenly the whole shape made sense.",
    body:
      "I stopped demanding certainty and started looking for the shape that kept repeating. That was enough to move forward.",
    image:
      "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2026-06-28-b",
    date: "2026-06-28",
    title: "The long note I finally sent",
    mood: "tender",
    preview:
      "It felt easier to write the thing than to keep carrying it alone.",
    body:
      "I kept the message simple. Sometimes clarity means choosing the shorter path to honesty.",
    image:
      "https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2026-06-21-a",
    date: "2026-06-21",
    title: "A restless list I kept revisiting",
    mood: "restless",
    preview:
      "Some thoughts circle until they become useful. Others circle because they want to be seen first.",
    body:
      "I wrote the list twice. The first version was for the noise, the second was for the truth beneath it.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2026-06-11-a",
    date: "2026-06-11",
    title: "The afternoon that felt wider",
    mood: "bright",
    preview:
      "Everything opened up a little once I stopped forcing the day to stay useful.",
    body:
      "There was a kind of room in the schedule I had not planned for, and it turned out to be the best part.",
    image:
      "https://images.unsplash.com/photo-1515442261605-65987783cb6f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2026-05-27-a",
    date: "2026-05-27",
    title: "An honest pause",
    mood: "still",
    preview:
      "I let the moment be incomplete and noticed that nothing broke.",
    body:
      "It was enough to sit with the feeling and not turn it into a project. That made it easier to understand.",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2026-05-18-a",
    date: "2026-05-18",
    title: "A conversation that stayed with me",
    mood: "tender",
    preview:
      "Some words linger because they were kind, and some because they were exact.",
    body:
      "I kept hearing one sentence all evening. It changed shape each time I remembered it, which seemed important.",
    image:
      "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2026-05-04-a",
    date: "2026-05-04",
    title: "What the morning gave me",
    mood: "clear",
    preview:
      "There was less urgency in the air, and more room to think without flinching.",
    body:
      "I began the day without a thesis. That made it easier to notice the useful details as they arrived.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2026-04-29-a",
    date: "2026-04-29",
    title: "The season turned quietly",
    mood: "bright",
    preview:
      "The light shifted before I did, and somehow that helped.",
    body:
      "I could tell the month was changing because the room started feeling less heavy at the same hour.",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2026-03-16-a",
    date: "2026-03-16",
    title: "The note I almost deleted",
    mood: "restless",
    preview:
      "I nearly erased it, which is how I knew it mattered.",
    body:
      "Sometimes the real task is to keep the thought long enough to understand why it arrived in the first place.",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2026-02-08-a",
    date: "2026-02-08",
    title: "A winter morning that stayed soft",
    mood: "still",
    preview:
      "The cold had edges, but the room did not.",
    body:
      "I wrote with my hands wrapped around a mug and let the page become the warmest place in the house.",
    image:
      "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2025-12-31-a",
    date: "2025-12-31",
    title: "A soft ending to a loud year",
    mood: "bright",
    preview:
      "I didn’t need a grand conclusion. I needed a moment to sit still and let the year finish speaking.",
    body:
      "The final page of the year felt more like a breath than a statement, which was exactly right.",
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "calendar-2025-11-03-a",
    date: "2025-11-03",
    title: "A note from the archive",
    mood: "clear",
    preview:
      "I found an old line that still knew how to speak to me.",
    body:
      "Some entries age into companions rather than records. This felt like one of those.",
    image:
      "https://images.unsplash.com/photo-1515442261605-65987783cb6f?auto=format&fit=crop&w=900&q=80",
  },
];
