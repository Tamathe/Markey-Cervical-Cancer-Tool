import type { Bilingual, HPVResult, Lang, PapResult, ScenarioKey } from "./types";

/** Pick the language-specific value, with sprintf-style arg interpolation. */
export function t(b: Bilingual, lang: Lang, ...args: string[]): string {
  let s = b[lang];
  args.forEach((a, i) => {
    s = s.replaceAll(`{${i}}`, a);
  });
  return s;
}

export const COPY = {
  appName: { en: "Markey Helper", es: "Markey Ayudante" },
  appSub: { en: "HPV / Pap results", es: "Resultados de VPH / Pap" },

  disclaimer: {
    en: "I'm a helper, not your doctor. For medical questions, call your clinic.",
    es: "Soy un ayudante, no su doctor. Para preguntas médicas, llame a su clínica.",
  },

  greet: {
    en: "Hi — I can explain your recent Pap or HPV result in plain words. Tap an option below or just type a question.",
    es: "Hola — puedo explicar su resultado de Pap o VPH en palabras sencillas. Toque una opción o escriba una pregunta.",
  },

  chipPhoto: { en: "I have my result paper", es: "Tengo el papel del resultado" },
  chipDescribe: { en: "I'll describe my results", es: "Describiré mi resultado" },
  chipAsk: { en: "Ask anything about HPV", es: "Preguntar sobre VPH" },
  chipHow: { en: "How do I schedule?", es: "¿Cómo agendo?" },

  // Suggested-questions row (shown beneath flow chips after outcome)
  somethingElse: { en: "Something else", es: "Otra cosa" },
  moreInfo: {
    en: "Tell me more about this result",
    es: "Cuénteme más sobre este resultado",
  },

  // Markey resources surface
  chipResources: { en: "More from Markey", es: "Más de Markey" },
  resourcesIntro: {
    en: "Markey makes fact sheets you can read or print. Here are a few.",
    es: "Markey tiene hojas informativas para leer o imprimir. Aquí hay algunas.",
  },
  resourcesPrimaryHeader: {
    en: "For this conversation:",
    es: "Para esta conversación:",
  },
  resourcesOtherHeader: {
    en: "Other cancer fact sheets:",
    es: "Otras hojas informativas:",
  },
  resourceLangBadge: { en: "(English)", es: "(en inglés)" },

  // Describe flow
  describeAsk: {
    en: "Okay — let's figure out what your paper says. First: does it mention HPV?",
    es: "Bien — veamos qué dice su papel. Primero: ¿menciona VPH?",
  },
  hpvPos: { en: "HPV positive (+)", es: "VPH positivo (+)" },
  hpvNeg: { en: "HPV negative (−)", es: "VPH negativo (−)" },
  hpvIDK: { en: "Not sure", es: "No estoy segura" },

  papAsk: {
    en: "Got it. And the Pap part — what words does it use?",
    es: "Entendido. La parte del Pap — ¿qué palabras usa?",
  },
  papNormal: { en: "Normal / negative", es: "Normal / negativo" },
  papAscus: { en: "ASC-US", es: "ASC-US" },
  papLsil: { en: "LSIL / low-grade", es: "LSIL / bajo grado" },
  papHsil: { en: "HSIL / high-grade", es: "HSIL / alto grado" },
  papAsch: { en: "ASC-H", es: "ASC-H" },
  papAgc: { en: "AGC / glandular", es: "AGC / glandular" },
  papUnsat: { en: "Unsatisfactory", es: "Insatisfactoria" },
  papOther: { en: "Other / not sure", es: "Otro / no segura" },

  // Redirects when the patient can't say their result confidently — the bot
  // does not guess. Routes to photo or a person.
  papOtherAns: {
    en: "No problem — those words are hard. Take a photo of your paper and I'll read it back, or talk to a person.",
    es: "Sin problema — esas palabras son difíciles. Tome una foto del papel y se la leo, o hable con una persona.",
  },
  hpvIdkAns: {
    en: "That's okay — many papers don't say HPV clearly. Take a photo of your paper and I'll read it back, or talk to a person.",
    es: "Está bien — muchos papeles no dicen VPH claramente. Tome una foto del papel y se la leo, o hable con una persona.",
  },

  confirm: {
    en: "So you saw **{0}** and **{1}**. Is that right?",
    es: "Entonces vio **{0}** y **{1}**. ¿Es correcto?",
  },
  yes: { en: "Yes, that's right", es: "Sí, es correcto" },
  no: { en: "Fix it", es: "Corregir" },
  startOver: {
    en: "No problem — let's start that part over.",
    es: "Sin problema — empecemos esa parte de nuevo.",
  },

  // Photo path
  photoAsk: {
    en: "Tap below to take a photo of your result paper. I'll read it back to you.",
    es: "Toque abajo para tomar una foto del papel. Se la leo de vuelta.",
  },
  photoTake: { en: "Take photo", es: "Tomar foto" },
  photoReading: { en: "reading the paper…", es: "leyendo el papel…" },
  photoRead: {
    en: "I read: **{0}** and **{1}**.",
    es: "Leí: **{0}** y **{1}**.",
  },
  photoSent: { en: "photo sent", es: "foto enviada" },

  // Outcomes (scenarios)
  nextStepLabel: { en: "YOUR NEXT STEP", es: "PRÓXIMO PASO" },

  // Action chips after outcome
  scriptCardTitle: { en: "Script for the call", es: "Guión para la llamada" },
  callBtn: { en: "Call clinic", es: "Llamar a la clínica" },
  scheduledBtn: { en: "I scheduled it", es: "Ya agendé" },
  remindMe: { en: "Add reminder", es: "Recordatorio" },
  needRide: { en: "I need a ride", es: "Necesito transporte" },
  needCost: { en: "What will this cost?", es: "¿Cuánto costará?" },
  talkPerson: { en: "Talk to a person", es: "Hablar con persona" },

  // Composer
  composer: { en: "Type or speak a question…", es: "Escriba o diga una pregunta…" },
  send: { en: "Send", es: "Enviar" },

  // Ask Anything (RAG)
  askIntro: {
    en: "Sure — ask me anything about HPV, Pap tests, or what happens next. I'll only answer from materials reviewed by health organizations.",
    es: "Claro — pregúnteme sobre el VPH, el Pap, o qué sigue. Solo respondo con materiales revisados por organizaciones de salud.",
  },
  askThinking: { en: "looking it up…", es: "buscando…" },
  askError: {
    en: "Something went wrong on my side. Try again, or rephrase your question.",
    es: "Algo falló de mi lado. Intente de nuevo, o reformule la pregunta.",
  },
  sourcesHeader: { en: "Sources", es: "Fuentes" },
  backToFlow: {
    en: "Back to my results",
    es: "Volver a mis resultados",
  },

  // Scheduling sub-flow
  schedulingHow: {
    en: "Call your clinic to set the appointment. I can give you a short script of what to say.",
    es: "Llame a su clínica para agendar. Le doy un guión corto.",
  },
  callingClinic: {
    en: "(simulated) Calling Polk-Dalton Clinic…",
    es: "(simulado) Llamando a la clínica Polk-Dalton…",
  },
  whenAppointment: {
    en: "Great. When's the appointment? I'll help you add it to your phone calendar.",
    es: "Excelente. ¿Cuándo es la cita? Le ayudo a agregarla al calendario.",
  },
  reminderAdded: {
    en: "Open your phone's calendar and add the appointment date. Your phone can remind you the day before. I'll be here if questions come up before the visit.",
    es: "Abra el calendario de su teléfono y agregue la fecha. Su teléfono le puede recordar el día antes. Aquí estoy si tiene preguntas antes de la visita.",
  },
  rideAns: {
    en: "Markey has patient navigators who help with rides. Want to talk to one?",
    es: "Markey tiene navegadoras que ayudan con transporte. ¿Quiere hablar con una?",
  },
  costAns: {
    en: "Cost depends on your insurance. Markey's financial team can give you an estimate. If you don't have insurance, the Kentucky Women's Cancer Screening Program may help (844-249-0708).",
    es: "El costo depende de su seguro. El equipo financiero de Markey puede dar un estimado. Si no tiene seguro, el Programa de Detección de Cáncer para Mujeres de Kentucky puede ayudar (844-249-0708).",
  },
  navigatorOK: {
    en: "Call **(859) 323-6542** and ask for a patient navigator. They help with rides, cost questions, and anything else.",
    es: "Llame al **(859) 323-6542** y pida una navegadora. Ayudan con transporte, costos, y otras preguntas.",
  },

  // Header controls
  langToggle: { en: "Español", es: "English" },
  readAloud: { en: "Read aloud", es: "Leer en voz alta" },
  readAloudOn: { en: "Read aloud: ON", es: "Leer en voz alta: SÍ" },
  readAloudOff: { en: "Read aloud: off", es: "Leer en voz alta: no" },
  largerText: { en: "A+ Larger text", es: "A+ Texto más grande" },
  largerTextOn: { en: "A+ Larger: ON", es: "A+ Más grande: SÍ" },
  restart: { en: "Restart", es: "Reiniciar" },
  speakNow: { en: "Listening…", es: "Escuchando…" },
} as const;

/** Outcome cards keyed by scenario. */
export const OUTCOMES: Record<
  ScenarioKey,
  {
    title: Bilingual;
    tldr: Bilingual;
    next: Bilingual;
    callScript: Bilingual | null;
  }
> = {
  "pos-normal": {
    title: { en: "HPV positive · Pap normal", es: "VPH positivo · Pap normal" },
    tldr: {
      en: "**Nothing urgent.** HPV was found, but your cells look normal. We just want to check again later.",
      es: "**Nada urgente.** Se encontró VPH, pero las células se ven normales. Solo revisamos otra vez después.",
    },
    next: {
      en: "Repeat Pap and HPV test in **1 year**. No procedure is needed now.",
      es: "Repetir Pap y prueba de VPH en **1 año**. No se necesita procedimiento ahora.",
    },
    callScript: null,
  },
  "pos-ascus": {
    title: { en: "HPV positive · Pap: ASC-US", es: "VPH positivo · Pap: ASC-US" },
    tldr: {
      en: "**Not cancer.** A small cell change was found. It's common. Your doctor will want a closer look.",
      es: "**No es cáncer.** Cambio pequeño en células. Es común. El doctor querrá ver más de cerca.",
    },
    next: {
      en: "**Colposcopy** — a closer look at the cervix in clinic. Usually about 20 minutes.",
      es: "**Colposcopía** — vista cercana del cuello uterino en la clínica. Unos 20 minutos.",
    },
    callScript: {
      en: "\"My HPV was positive and my Pap said ASC-US. My doctor wants a colposcopy.\"",
      es: "\"Mi VPH fue positivo y el Pap dice ASC-US. El doctor pidió colposcopía.\"",
    },
  },
  "pos-lsil": {
    title: { en: "HPV positive · Pap: LSIL", es: "VPH positivo · Pap: LSIL" },
    tldr: {
      en: "**Not cancer.** A low-grade change was found. Your doctor will want a closer look.",
      es: "**No es cáncer.** Cambio de bajo grado. El doctor querrá ver más de cerca.",
    },
    next: {
      en: "**Colposcopy** — a closer look at the cervix in clinic. Usually about 20 minutes.",
      es: "**Colposcopía** — vista cercana del cuello uterino en la clínica. Unos 20 minutos.",
    },
    callScript: {
      en: "\"My HPV was positive and my Pap said LSIL. My doctor wants a colposcopy.\"",
      es: "\"Mi VPH fue positivo y el Pap dice LSIL. El doctor pidió colposcopía.\"",
    },
  },
  // TODO(Cooper): scenarios below are clinical-phrasing drafts and must be
  // reviewed and approved before the prototype is shown to patients.
  "pos-hsil": {
    title: { en: "HPV positive · Pap: HSIL", es: "VPH positivo · Pap: HSIL" },
    tldr: {
      en: "**Not cancer right now.** A high-grade change was found. The doctor will want a closer look soon.",
      es: "**No es cáncer ahora.** Se encontró un cambio de alto grado. El doctor querrá ver más de cerca pronto.",
    },
    next: {
      en: "**Colposcopy**, usually within a few weeks. Sometimes a small treatment is done the same day.",
      es: "**Colposcopía**, usualmente en pocas semanas. A veces se hace un pequeño tratamiento el mismo día.",
    },
    callScript: {
      en: "\"My HPV was positive and my Pap said HSIL. My doctor wants a colposcopy.\"",
      es: "\"Mi VPH fue positivo y el Pap dice HSIL. El doctor pidió colposcopía.\"",
    },
  },
  "pos-asch": {
    title: { en: "HPV positive · Pap: ASC-H", es: "VPH positivo · Pap: ASC-H" },
    tldr: {
      en: "**Not cancer.** A change was found that the lab couldn't fully sort out. Your doctor will want a closer look.",
      es: "**No es cáncer.** Un cambio que el laboratorio no pudo clasificar bien. El doctor querrá ver más de cerca.",
    },
    next: {
      en: "**Colposcopy** — a closer look at the cervix in clinic. Usually about 20 minutes.",
      es: "**Colposcopía** — vista cercana del cuello uterino en la clínica. Unos 20 minutos.",
    },
    callScript: {
      en: "\"My HPV was positive and my Pap said ASC-H. My doctor wants a colposcopy.\"",
      es: "\"Mi VPH fue positivo y el Pap dice ASC-H. El doctor pidió colposcopía.\"",
    },
  },
  "pos-agc": {
    title: { en: "HPV positive · Pap: AGC", es: "VPH positivo · Pap: AGC" },
    tldr: {
      en: "**Not cancer.** A change was found in glandular cells. Your doctor will want more tests.",
      es: "**No es cáncer.** Se encontró un cambio en células glandulares. El doctor querrá más pruebas.",
    },
    next: {
      en: "**Colposcopy plus a sample from inside the uterus.** The doctor checks both the cervix and the uterine lining.",
      es: "**Colposcopía más una muestra de adentro del útero.** El doctor revisa el cuello uterino y el revestimiento del útero.",
    },
    callScript: {
      en: "\"My HPV was positive and my Pap said AGC, atypical glandular cells. My doctor wants colposcopy and an endometrial biopsy.\"",
      es: "\"Mi VPH fue positivo y el Pap dice AGC, células glandulares atípicas. El doctor pidió colposcopía y biopsia endometrial.\"",
    },
  },
  "pos-unsat": {
    title: { en: "HPV positive · Pap: Unsatisfactory", es: "VPH positivo · Pap: Insatisfactoria" },
    tldr: {
      en: "**Not a result yet.** The sample wasn't clear enough to read. The doctor will need another sample.",
      es: "**Aún no hay resultado.** La muestra no estuvo clara para leer. El doctor necesitará otra muestra.",
    },
    next: {
      en: "Usually a **repeat Pap in 2 to 4 months**. Your doctor will tell you the exact timing.",
      es: "Usualmente **repetir el Pap en 2 a 4 meses**. El doctor le dirá el tiempo exacto.",
    },
    callScript: {
      en: "\"My HPV was positive but my Pap was unsatisfactory. My doctor wants me to repeat the Pap.\"",
      es: "\"Mi VPH fue positivo pero el Pap fue insatisfactorio. El doctor pidió repetir el Pap.\"",
    },
  },
  "neg-normal": {
    title: { en: "HPV negative · Pap normal", es: "VPH negativo · Pap normal" },
    tldr: {
      en: "**Routine result.** No HPV and no cell change. Nothing to do now.",
      es: "**Resultado de rutina.** Sin VPH y sin cambio en células. Nada que hacer ahora.",
    },
    next: {
      en: "Repeat **Pap and HPV test in 5 years**, or as your doctor recommends.",
      es: "Repetir **Pap y prueba de VPH en 5 años**, o como su doctor recomiende.",
    },
    callScript: null,
  },
  "neg-ascus": {
    title: { en: "HPV negative · Pap: ASC-US", es: "VPH negativo · Pap: ASC-US" },
    tldr: {
      en: "**Not cancer, lower risk.** A small change was found, but HPV was not — that's reassuring.",
      es: "**No es cáncer, bajo riesgo.** Cambio pequeño pero sin VPH — es tranquilizador.",
    },
    next: {
      en: "Repeat **Pap and HPV test in 3 years**, unless your doctor says otherwise.",
      es: "Repetir **Pap y prueba de VPH en 3 años**, salvo que el doctor diga otra cosa.",
    },
    callScript: null,
  },
  "neg-lsil": {
    title: { en: "HPV negative · Pap: LSIL", es: "VPH negativo · Pap: LSIL" },
    tldr: {
      en: "**Not cancer.** A small change was found, but HPV was not — that's reassuring.",
      es: "**No es cáncer.** Se encontró un cambio pequeño, pero sin VPH — es tranquilizador.",
    },
    next: {
      en: "Repeat **Pap and HPV test in 1 year**, unless your doctor says otherwise.",
      es: "Repetir **Pap y prueba de VPH en 1 año**, salvo que el doctor diga otra cosa.",
    },
    callScript: null,
  },
};

export function hpvLabel(k: HPVResult, lang: Lang): string {
  if (k === "pos") return t(COPY.hpvPos, lang);
  if (k === "neg") return t(COPY.hpvNeg, lang);
  return t(COPY.hpvIDK, lang);
}
export function papLabel(k: PapResult, lang: Lang): string {
  if (k === "normal") return t(COPY.papNormal, lang);
  if (k === "ascus") return t(COPY.papAscus, lang);
  if (k === "lsil") return t(COPY.papLsil, lang);
  if (k === "hsil") return t(COPY.papHsil, lang);
  if (k === "asch") return t(COPY.papAsch, lang);
  if (k === "agc") return t(COPY.papAgc, lang);
  if (k === "unsat") return t(COPY.papUnsat, lang);
  return t(COPY.papOther, lang);
}

export function outcomeKey(hpv: HPVResult, pap: PapResult): ScenarioKey {
  // High-grade and special findings: management is similar regardless of HPV.
  if (pap === "hsil") return "pos-hsil";
  if (pap === "asch") return "pos-asch";
  if (pap === "agc") return "pos-agc";
  if (pap === "unsat") return "pos-unsat";

  if (hpv === "pos" || hpv === "idk") {
    if (pap === "normal") return "pos-normal";
    if (pap === "lsil") return "pos-lsil";
    return "pos-ascus";
  }

  if (pap === "normal") return "neg-normal";
  if (pap === "lsil") return "neg-lsil";
  return "neg-ascus";
}
