export type JournalCollection = {
  id: string;
  coverImage: string;
  name: string;
  itemCount: number;
  summary: string;
  tone: string;
};

export const initialCollections: JournalCollection[] = [
  {
    id: "travel",
    name: "Travel",
    tone: "Open skies and moving horizons",
    summary:
      "Places, departures, arrivals, and the moments that made a journey feel memorable.",
    itemCount: 12,
    coverImage:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "college",
    name: "College",
    tone: "Late nights and formative years",
    summary:
      "Notes from classrooms, dorm rooms, and the years that quietly changed everything.",
    itemCount: 18,
    coverImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "family",
    name: "Family",
    tone: "Shared rituals and remembered voices",
    summary:
      "Meals, holidays, conversations, and the small details that keep belonging alive.",
    itemCount: 9,
    coverImage:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "goals",
    name: "Goals",
    tone: "Direction without harshness",
    summary:
      "A place for intentions that need to stay visible but still feel humane.",
    itemCount: 7,
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "dreams",
    name: "Dreams",
    tone: "Half-remembered images and future possibilities",
    summary:
      "Fragments, symbols, and ideas that arrive while the rest of the house is asleep.",
    itemCount: 14,
    coverImage:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
  },
];
