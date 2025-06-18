import { cx } from "@util/cx";
import "./PageNavButton.css";
import Doc from "@icons/doc.svg?react";
import More from "@icons/more.svg?react";
import { ReactElement } from "react";

interface Props {
  id: string;
  label: string;
  href: string;
  isActive: boolean;
  icon?: ReactElement;

  /**
   * On pointer down even that may be a click or drag.
   */
  onPointerDown: React.PointerEventHandler;

  /**
   * On a known "click" or keyboard equivalent. Cannot be a drag.
   * @param id ID of this button.
   */
  onClick: (id: string) => void;
}

export function PageNavButton({
  id,
  label,
  href,
  isActive,
  onPointerDown,
  onClick,
  icon,
}: Props) {
  function handleAnchorClick(e: React.MouseEvent) {
    e.preventDefault();
    onClick(id);
  }

  return (
    <div
      className={cx("PageNavButton", { "is-active": isActive })}
      onPointerDown={onPointerDown}
      data-page-id={id}
    >
      <div className="PageNavButton__icon">{icon ?? <Doc />}</div>

      <a
        href={href}
        onClick={handleAnchorClick}
        className="PageNavButton__link"
      >
        {label}
      </a>
      <button className="PageNavButton__menu-button">
        <More />
      </button>
    </div>
  );
}
