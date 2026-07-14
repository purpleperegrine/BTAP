"use client";

import { useRef, useState } from "react";

export function MobileMenu() {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    detailsRef.current?.removeAttribute("open");
    setIsOpen(false);
  }

  return (
    <details
      className="mobile-menu"
      ref={detailsRef}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          closeMenu();
          summaryRef.current?.focus();
        }
      }}
    >
      <summary
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        ref={summaryRef}
      >
        Menu
      </summary>
      <nav aria-label="Mobile navigation">
        <a href="#food-menu" onClick={closeMenu}>
          Food menu
        </a>
        <a href="#beer-menu" onClick={closeMenu}>
          Beer menu
        </a>
        <a href="#live-music" onClick={closeMenu}>
          Live music
        </a>
        <a href="#visit" onClick={closeMenu}>
          Hours &amp; location
        </a>
      </nav>
    </details>
  );
}
