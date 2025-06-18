import { Menu, MenuItem } from "@components/Menu/Menu";
import Doc from "@icons/doc.svg?react";
import More from "@icons/more.svg?react";
import { cx } from "@util/cx";
import { ReactElement, useCallback, useRef, useState } from "react";
import "./PageNavButton.css";

import Duplicate from "@icons/copy.svg?react";
import Delete from "@icons/delete.svg?react";
import Rename from "@icons/edit.svg?react";
import Flag from "@icons/flag.svg?react";
import Paste from "@icons/paste.svg?react";

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

const menuItems: MenuItem[] = [
  {
    id: "first",
    label: "Set as first page",
    icon: <Flag />,
    type: "primary",
  },
  {
    id: "rename",
    label: "Rename",
    icon: <Rename />,
  },
  {
    id: "copy",
    label: "Copy",
    icon: <Paste />,
  },
  {
    id: "duplicate",
    label: "Duplicate",
    icon: <Duplicate />,
  },
  {
    id: "delete",
    label: "Delete",
    icon: <Delete />,
    type: "danger",
    isSeparated: true,
  },
];

export function PageNavButton({
  id,
  label,
  href,
  isActive,
  onPointerDown,
  onClick,
  icon,
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleAnchorClick(e: React.MouseEvent) {
    e.preventDefault();
    onClick(id);
  }

  const ref = useRef<HTMLDivElement>(null);

  function toggleMenu() {
    setIsMenuOpen((prevOpen) => !prevOpen);
  }

  const handleClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <div
      className={cx("PageNavButton", { "is-active": isActive })}
      onPointerDown={onPointerDown}
      data-page-id={id}
      ref={ref}
    >
      <div className="PageNavButton__icon">{icon ?? <Doc />}</div>

      <a
        href={href}
        onClick={handleAnchorClick}
        className="PageNavButton__link truncate"
      >
        {label}
      </a>
      <button className="PageNavButton__menu-button" onClick={toggleMenu}>
        <More />
      </button>

      {isMenuOpen && (
        <Menu
          open={isMenuOpen}
          heading="Settings"
          items={menuItems}
          near={ref.current}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
