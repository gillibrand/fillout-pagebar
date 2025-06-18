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

/**
 * Selector for query with querySelector for picking out buttons from the. Added this here since I
 * was late to add the Add Page button at the end. Really, that should share styles and not be the
 * same control, but I'm rushing this a bit :( Just need to exclude the special Add button for now.
 */
export const PageNavButtonSelector = ".PageNavButton:not(.is-add)";

interface Props {
  id: string;
  label: string;
  href: string;
  isActive: boolean;
  icon?: ReactElement;

  /**
   * On pointer down even that may be a click or drag.
   */
  onPointerDown?: React.PointerEventHandler;

  /**
   * On a known "click" or keyboard equivalent. Cannot be a drag.
   * @param id ID of this button.
   */
  onClick: (id: string) => void;

  /**
   * A bit of a hack to get the Add button in quickly. Was not listed in requirements, but is in
   * Figma... so shoving in.
   */
  isAddButton?: boolean;
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
  isAddButton,
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
    <>
      <div
        className={cx("PageNavButton", {
          "is-active": isActive,
          "is-add": isAddButton,
        })}
        onPointerDown={onPointerDown}
        data-page-id={id}
        ref={ref}
        style={isAddButton ? { marginInlineStart: "1.5rem" } : undefined}
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
      </div>

      {isMenuOpen && (
        <Menu
          open={isMenuOpen}
          heading="Settings"
          items={menuItems}
          near={ref.current}
          onClose={handleClose}
        />
      )}
    </>
  );
}
