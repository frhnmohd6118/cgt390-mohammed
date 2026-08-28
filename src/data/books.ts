export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  description: string;
  coverStyle: string;
};

export const books: Book[] = [
  { id: "tide-house", title: "The Tide House", author: "Mara Venn", genre: "Literary fiction", year: 2025, description: "When a cartographer inherits a house that appears only at low tide, she must map its rooms before the sea returns.", coverStyle: "cover-blue" },
  { id: "small-weather", title: "Small Weather", author: "Iris Bell", genre: "Magical realism", year: 2024, description: "A quiet town begins trading memories for rain, and one young meteorologist keeps finding storms in her kitchen.", coverStyle: "cover-sage" },
  { id: "orbit-of-ashes", title: "Orbit of Ashes", author: "Jonah Kade", genre: "Science fiction", year: 2025, description: "On a mining station above a dying sun, a maintenance crew discovers a message from the future in the station walls.", coverStyle: "cover-ink" },
  { id: "museum-of-lost-days", title: "Museum of Lost Days", author: "Nia Sol", genre: "Mystery", year: 2023, description: "A museum archivist finds an exhibit labeled with tomorrow's date and a photograph of a visitor who has not arrived.", coverStyle: "cover-coral" },
  { id: "field-notes-for-quiet", title: "Field Notes for a Quiet Life", author: "Tomas Reed", genre: "Nature writing", year: 2024, description: "A year of walks, small observations, and the overlooked places that teach us how to pay attention.", coverStyle: "cover-yellow" },
  { id: "the-last-lantern", title: "The Last Lantern", author: "Amaya North", genre: "Historical adventure", year: 2022, description: "Along a coast without stars, a lighthouse keeper follows a trail of impossible lights toward an old family secret.", coverStyle: "cover-lilac" },
];

export function getBook(id: string) {
  return books.find((book) => book.id === id);
}