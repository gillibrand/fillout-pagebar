import { useRef, useState } from "react";
import "./HoverSeparator.css";
import { cx } from "@util/cx";
import Plus from "@icons/add.svg?react";

/**
 * Component used between pages in the PageNav. This shows as a small dot on initial hover, then
 * grows to a button after a short delay. This allows for it to be non-intrusive at take little
 * space, but make it easy to insert between pages.
 */
export function HoverSeparator() {
  const [isActive, setIsActive] = useState(false);

  const hoverTimeout = useRef(-1);

  function handleEnter() {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setIsActive(true);
    }, 400);
  }

  function handleLeave() {
    clearTimeout(hoverTimeout.current);
    setIsActive(false);
  }

  return (
    <div
      className={cx("HoverSeparator", { "is-active": isActive })}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >
      <button className="HoverSeparator__button">
        <Plus className="HoverSeparator__icon" />
      </button>
    </div>
  );
}
