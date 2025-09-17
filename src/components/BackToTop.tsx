"use client";

import { useEffect, useRef, useState } from "react";

export default function BackToTop({
  showAfter = 300, // px de rolagem para começar a exibir
}: { showAfter?: number }) {
  const [visible, setVisible] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > showAfter);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    onScroll(); // checa no carregamento
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfter]);

  const scrollTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // fallback
      window.scrollTo(0, 0);
    }
  };

  return (
    <button
      type="button"
      onClick={scrollTop}
      title="Voltar ao topo"
      aria-label="Voltar ao topo"
      className={[
        "fixed z-50 bottom-5 right-5 sm:bottom-6 sm:right-6",
        "rounded-full bg-[#202630] text-white shadow-lg",
        "p-3 sm:p-3.5",
        "hover:bg-[#1b2029] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600",
        "transition-opacity transition-transform",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
      ].join(" ")}
    >
      {/* ícone seta pra cima */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">Voltar ao topo</span>
    </button>
  );
}
