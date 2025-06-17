import { cx } from "@util/cx";
import "./PageNavButton.css";

interface Props {
  id: string;
  label: string;
  href: string;
  isActive: boolean;

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
}: Props) {
  return (
    <div
      className={cx("PageNavButton", { "is-active": isActive })}
      onPointerDown={onPointerDown}
      data-id={id}
    >
      <a href={href} onClick={() => onClick(id)}>
        {label}
      </a>
      <button className="PageNavButton__menu-button">︙</button>
    </div>
  );
}
