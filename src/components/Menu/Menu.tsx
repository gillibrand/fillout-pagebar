import { cx } from "@util/cx";
import { ReactElement } from "react";
import { createPortal } from "react-dom";
import "./Menu.css";

export type MenuItemType = "danger" | "primary";

export interface MenuItem {
  id: string;
  label: string;
  icon: ReactElement;
  type?: MenuItemType;
  isSeparated?: boolean;
}

interface MenuProps {
  heading: string;
  items: MenuItem[];
}

function MenuItem({ icon, label, type, isSeparated }: MenuItem) {
  return (
    <li
      className={cx(
        "MenuItem",
        { "is-danger": type === "danger" },
        { "is-primary": type === "primary" }
      )}
    >
      {isSeparated && <hr className="MenuItem__separator" />}
      <button className="MenuItem__button">
        {icon} {label}
      </button>
    </li>
  );
}

export function Menu({ heading, items }: MenuProps) {
  //   useEffect(() => {}, []);

  //   const ref = useRef<HTMLDivElement>(null);

  function onRef(root: HTMLDivElement | null) {
    root?.focus();
  }

  return createPortal(
    <div className="Menu" tabIndex={-1} ref={onRef}>
      {heading && (
        <>
          <div className="Menu__heading">Settings</div>
          <hr />
        </>
      )}
      <ul className="Menu__list">
        {items.map((item) => (
          <MenuItem key={item.id} {...item} />
        ))}
        <li></li>
      </ul>
    </div>,
    document.body
  );
}
