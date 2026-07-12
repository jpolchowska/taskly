"use client";

import { useEffect, useState } from "react";
import { getRandomQuote, type Quote } from "@/lib/api";

export function QuoteCard() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    getRandomQuote()
      .then(setQuote)
      .catch(() => setQuote(null));
  }, []);

  return (
    <div className="relative mb-10 overflow-hidden rounded-[20px] bg-brand-wash px-12 py-9 text-center shadow-(--shadow-card)">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-4.5 left-2 select-none font-serif text-[140px] leading-none text-brand opacity-10 dark:opacity-20"
      >
        “
      </div>
      <p className="relative mx-auto min-h-[33px] max-w-155 font-serif text-[22px] leading-relaxed italic text-foreground">
        {quote ? `“${quote.text}”` : " "}
      </p>
      <div className="relative mt-3.5 text-[13px] font-medium tracking-wide text-muted-foreground">
        {quote ? `— ${quote.author}` : " "}
      </div>
    </div>
  );
}
