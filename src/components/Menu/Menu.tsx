import { cx } from "@util/cx";
import {
  ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
  open: boolean;

  /**
   * Callback when this menu really closes. Fires after close animation.
   */
  onClose: () => void;

  /**
   * The button that opened this menu and it should be placed near. Assumes the button is on the
   * bottom of page. Real menus would measure their size and viewport.
   */
  near: HTMLElement | null;
}

const AnimOptions = {
  duration: 100,
  easing: "ease-in-out",
  fill: "forwards",
} as KeyframeAnimationOptions;

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

/**
 * Trivial menu component. No support for click callbacks... just closes on click.
 * FIXME: Does NOT support keyboard... just CSS hover.
 */
export function Menu({ open, heading, items, near, onClose }: MenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const [style, setStyle] = useState<React.CSSProperties | undefined>(
    undefined
  );

  const animateClose = useCallback(async () => {
    const menu = ref.current;
    if (!menu) return;

    await menu.animate(
      {
        scale: [1, 0.95],
        opacity: [1, 0],
      },
      AnimOptions
    ).finished;

    onClose();
  }, [onClose]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    if (open && near) {
      const nearRect = near.getBoundingClientRect();
      const refRect = ref.current.getBoundingClientRect();
      setStyle({
        top: `${nearRect.y - refRect.height - 8}px`,
        left: `${nearRect.x}px`,
      });
    }

    if (open) {
      const menu = ref.current;
      if (!menu) return;

      const anim = menu.animate(
        {
          scale: [0.95, 1],
          opacity: [0.4, 1],
        },
        AnimOptions
      );

      return () => {
        anim.cancel();
      };
    } else {
      animateClose();
    }
  }, [near, open, animateClose]);

  function handleBlur() {
    animateClose();
  }

  return createPortal(
    <div
      className={cx("Menu")}
      tabIndex={-1}
      ref={ref}
      style={style}
      onBlur={handleBlur}
    >
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
