import type { Bilingual, ScenarioKey } from "./types";

// TODO(Cooper): these question lists are placeholders to validate the UX flow.
// They must be reviewed and approved before the prototype is shown to patients.
// Each scenario gets exactly 3 questions — patient-typical first-asks, in the
// order a worried person would land on them.
export const SUGGESTED_QUESTIONS: Record<
  ScenarioKey,
  [Bilingual, Bilingual, Bilingual]
> = {
  "pos-normal": [
    {
      en: "What does HPV+ mean if my Pap is normal?",
      es: "¿Qué significa VPH+ si mi Pap es normal?",
    },
    {
      en: "Will this go away on its own?",
      es: "¿Esto desaparece por sí solo?",
    },
    {
      en: "Do I need to do anything different?",
      es: "¿Necesito hacer algo diferente?",
    },
  ],
  "pos-ascus": [
    { en: "Is this cancer?", es: "¿Esto es cáncer?" },
    {
      en: "Can I still have kids?",
      es: "¿Puedo todavía tener hijos?",
    },
    {
      en: "Should I tell my partner?",
      es: "¿Debo decirle a mi pareja?",
    },
  ],
  "pos-lsil": [
    { en: "What is LSIL?", es: "¿Qué es LSIL?" },
    {
      en: "Will I need a procedure?",
      es: "¿Necesitaré un procedimiento?",
    },
    {
      en: "Can I still have kids?",
      es: "¿Puedo todavía tener hijos?",
    },
  ],
  "pos-hsil": [
    { en: "Is this cancer?", es: "¿Esto es cáncer?" },
    { en: "Will I need surgery?", es: "¿Necesitaré cirugía?" },
    {
      en: "Can I still have kids?",
      es: "¿Puedo todavía tener hijos?",
    },
  ],
  "pos-asch": [
    { en: "Is this cancer?", es: "¿Esto es cáncer?" },
    { en: "What does ASC-H mean?", es: "¿Qué significa ASC-H?" },
    {
      en: "Will I need a procedure?",
      es: "¿Necesitaré un procedimiento?",
    },
  ],
  "pos-agc": [
    { en: "Is this cancer?", es: "¿Esto es cáncer?" },
    {
      en: "Why an endometrial biopsy?",
      es: "¿Por qué una biopsia endometrial?",
    },
    {
      en: "Can I still have kids?",
      es: "¿Puedo todavía tener hijos?",
    },
  ],
  "pos-unsat": [
    { en: "Did I do something wrong?", es: "¿Hice algo mal?" },
    {
      en: "When should I repeat the test?",
      es: "¿Cuándo debo repetir la prueba?",
    },
    {
      en: "Could this be hiding cancer?",
      es: "¿Podría esto esconder cáncer?",
    },
  ],
  "neg-normal": [
    { en: "Why every 5 years?", es: "¿Por qué cada 5 años?" },
    {
      en: "Do I still need the HPV vaccine?",
      es: "¿Todavía necesito la vacuna del VPH?",
    },
    {
      en: "When's my next test?",
      es: "¿Cuándo es mi próxima prueba?",
    },
  ],
  "neg-ascus": [
    {
      en: "If HPV is negative, why is my Pap abnormal?",
      es: "Si el VPH es negativo, ¿por qué mi Pap es anormal?",
    },
    {
      en: "When's my next Pap?",
      es: "¿Cuándo es mi próximo Pap?",
    },
    {
      en: "Should I be worried?",
      es: "¿Debo preocuparme?",
    },
  ],
  "neg-lsil": [
    {
      en: "If HPV is negative, why is my Pap abnormal?",
      es: "Si el VPH es negativo, ¿por qué mi Pap es anormal?",
    },
    {
      en: "When's my next Pap?",
      es: "¿Cuándo es mi próximo Pap?",
    },
    {
      en: "Should I be worried?",
      es: "¿Debo preocuparme?",
    },
  ],
};
