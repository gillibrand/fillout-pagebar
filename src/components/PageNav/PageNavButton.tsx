import { cx } from "@util/cx";
import "./PageNavButton.css";

interface Props {
  id: string;
  label: string;
  href: string;
  onPointerDown: React.PointerEventHandler;
  isActive: boolean;
}

export function PageNavButton({
  id,
  label,
  href,
  isActive,
  onPointerDown,
}: Props) {
  return (
    <div
      className={cx("PageNavButton", { "is-active": isActive })}
      onPointerDown={onPointerDown}
      data-id={id}
    >
      <a href={href}>{label}</a>
      <button className="PageNavButton__menu-button">︙</button>
    </div>
  );
}
