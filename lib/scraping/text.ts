const NBSP = " ";

export function cleanText(text: string): string {
  return text.split(NBSP).join(" ").replace(/\s+/g, " ").trim();
}

export function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}
