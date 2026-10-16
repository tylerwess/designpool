"use client";

import { useRef, useState } from "react";

/** Chrome's built-in on-device Translator API (138+). Absent in other browsers. */
type BrowserTranslator = { translate(text: string): Promise<string> };
type TranslatorFactory = {
  availability(options: { sourceLanguage: string; targetLanguage: string }): Promise<string>;
  create(options: { sourceLanguage: string; targetLanguage: string }): Promise<BrowserTranslator>;
};

function builtInTranslator(): TranslatorFactory | null {
  const candidate = (globalThis as { Translator?: TranslatorFactory }).Translator;
  return candidate ?? null;
}

/** Text nodes under every [data-translatable] element, skipping whitespace-only ones. */
function translatableTextNodes(): Text[] {
  const nodes: Text[] = [];
  for (const root of document.querySelectorAll("[data-translatable]")) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.textContent?.trim()) nodes.push(node as Text);
    }
  }
  return nodes;
}

function TranslateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path
        d="M4 5h9M8.5 3v2m2.5 0c-.6 3.9-3 7-6.5 8.5M6.5 9c1 2 2.6 3.5 4.5 4.3M13 21l4-9 4 9m-6.8-3h5.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Status = "original" | "working" | "translated" | "failed";

/**
 * Floating "Translate to English" control for non-English listings. Translates the title and
 * description in place with the browser's on-device translator and toggles back to the original.
 * Where that isn't available, it opens this page through Google Translate in a new tab.
 */
export function TranslateListing({ sourceLanguage, languageName }: { sourceLanguage: string; languageName: string }) {
  const [status, setStatus] = useState<Status>("original");
  const originals = useRef(new Map<Text, string>());

  async function translate() {
    const factory = builtInTranslator();
    const fallback = () =>
      window.open(
        `https://translate.google.com/translate?sl=${sourceLanguage}&tl=en&u=${encodeURIComponent(window.location.href)}`,
        "_blank",
        "noopener,noreferrer",
      );

    if (!factory) {
      fallback();
      return;
    }

    setStatus("working");
    try {
      const options = { sourceLanguage, targetLanguage: "en" };
      if ((await factory.availability(options)) === "unavailable") {
        setStatus("original");
        fallback();
        return;
      }
      const translator = await factory.create(options);
      for (const node of translatableTextNodes()) {
        if (!originals.current.has(node)) originals.current.set(node, node.textContent ?? "");
        node.textContent = await translator.translate(originals.current.get(node)!);
      }
      setStatus("translated");
    } catch {
      setStatus("failed");
    }
  }

  function restore() {
    for (const [node, text] of originals.current) node.textContent = text;
    setStatus("original");
  }

  // Full label from sm up; a short one on phones so Apply keeps its room in the bottom bar.
  const [label, shortLabel] =
    status === "working"
      ? ["Translating…", "Translating…"]
      : status === "translated"
        ? [`Show original (${languageName})`, "Original"]
        : status === "failed"
          ? ["Couldn’t translate. Try again", "Retry"]
          : ["Translate to English", "Translate"];

  return (
    <button
      type="button"
      onClick={status === "translated" ? restore : translate}
      disabled={status === "working"}
      aria-live="polite"
      aria-label={label}
      className="btn-outline floating-translate-button inline-flex h-11 items-center justify-center gap-2 rounded-[4px] bg-bg px-5 font-sans text-sm font-semibold disabled:opacity-60"
    >
      <TranslateIcon />
      <span className="whitespace-nowrap sm:hidden">{shortLabel}</span>
      <span className="hidden whitespace-nowrap sm:inline">{label}</span>
    </button>
  );
}
