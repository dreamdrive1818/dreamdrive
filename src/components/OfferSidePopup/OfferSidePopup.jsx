import React, { useEffect, useState } from "react";
import "./OfferSidePopup.css";

/**
 * OfferSidePopup
 * - Auto opens on load
 * - Close => shrinks to ❄️ button
 * - Click ❄️ => opens again
 *
 * Props:
 * - percent (number|string) default 10
 * - title (string) default "Flat 10% OFF"
 * - subtitle (string) default "Limited time festive deal"
 * - ctaText (string) optional
 * - onCta (function) optional
 * - theme (string) "christmas" | "default" (affects styling)
 */
const OfferSidePopup = ({
  percent = 10,
  title = "Flat 10% OFF",
  subtitle = "Limited time festive deal",
  ctaText = "Book Now",
  onCta,
  theme = "christmas",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto open on first mount
  useEffect(() => {
    const t = setTimeout(() => {
      setIsOpen(true);
      setIsMinimized(false);
    }, 450); // small delay feels nicer
    return () => clearTimeout(t);
  }, []);

  const closeToSnow = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  const openPopup = () => {
    setIsMinimized(false);
    setIsOpen(true);
  };

  const handleCta = () => {
    if (typeof onCta === "function") return onCta();
    // fallback: do nothing (or you can navigate from parent)
  };

  return (
    <>
      {/* Side Popup */}
      <aside
        className={[
          "offer-pop",
          `offer-pop--${theme}`,
          isOpen ? "offer-pop--open" : "offer-pop--closed",
        ].join(" ")}
        role="dialog"
        aria-modal="false"
        aria-label="Offer popup"
      >
        <button
          className="offer-pop__close"
          type="button"
          onClick={closeToSnow}
          aria-label="Close offer"
        >
          ✕
        </button>

        <div className="offer-pop__badge">
          <span className="offer-pop__badgeIcon" aria-hidden="true">
            🎁
          </span>
          <span className="offer-pop__badgeText">Festive Offer</span>
        </div>

        <h3 className="offer-pop__title">
          {title} <span className="offer-pop__percent">{percent}%</span>
        </h3>

        <p className="offer-pop__subtitle">{subtitle}</p>

        <div className="offer-pop__divider" />

        <ul className="offer-pop__points">
          <li>Instant booking support</li>
          <li>Rent or Self Drive</li>
          <li>Limited slots today</li>
        </ul>

        <div className="offer-pop__actions">
          <button className="offer-pop__cta" type="button" onClick={handleCta}>
            {ctaText}
          </button>
          <button
            className="offer-pop__ghost"
            type="button"
            onClick={closeToSnow}
          >
            Later
          </button>
        </div>
      </aside>

      {/* ❄️ Minimized Snow Button */}
      {isMinimized && (
        <button
          className={["snow-fab", `snow-fab--${theme}`].join(" ")}
          type="button"
          onClick={openPopup}
          aria-label="Open offer"
          title="Open offer"
        >
          ❄️
        </button>
      )}
    </>
  );
};

export default OfferSidePopup;
