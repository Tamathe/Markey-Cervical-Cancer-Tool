import type { Bilingual } from "./types";

export type MarkeyResource = {
  id: string;
  title: Bilingual;
  /** Filename inside /public/markey-resources/ */
  filename: string;
  /** Languages the source document is available in. */
  language: "en";
  /** Primary resource for this tool (cervical fact sheet). */
  primary?: boolean;
};

// All PDFs are originals sent by Markey Cancer Center, May 2026.
// Stored at /public/markey-resources/ and served as static files.
export const MARKEY_RESOURCES: MarkeyResource[] = [
  {
    id: "cervical",
    title: {
      en: "Cervical Cancer Fact Sheet",
      es: "Hoja informativa: cáncer cervical",
    },
    filename: "cervical-cancer-fact-sheet.pdf",
    language: "en",
    primary: true,
  },
  {
    id: "breast",
    title: {
      en: "Breast Cancer Fact Sheet",
      es: "Hoja informativa: cáncer de mama",
    },
    filename: "breast-cancer-fact-sheet.pdf",
    language: "en",
  },
  {
    id: "colon",
    title: {
      en: "Colon Cancer Fact Sheet",
      es: "Hoja informativa: cáncer de colon",
    },
    filename: "colon-cancer-fact-sheet.pdf",
    language: "en",
  },
  {
    id: "lung",
    title: {
      en: "Lung Cancer Fact Sheet",
      es: "Hoja informativa: cáncer de pulmón",
    },
    filename: "lung-cancer-fact-sheet.pdf",
    language: "en",
  },
  {
    id: "prostate",
    title: {
      en: "Prostate Cancer Fact Sheet",
      es: "Hoja informativa: cáncer de próstata",
    },
    filename: "prostate-cancer-fact-sheet.pdf",
    language: "en",
  },
];

export function resourceHref(r: MarkeyResource): string {
  return `/markey-resources/${r.filename}`;
}
