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
    // Get focus so we can clone on blur.
    ref.current?.focus();
  }, []);

  // Style for custom positioning
  const [style, setStyle] = useState<React.CSSProperties | undefined>(
    undefined
  );

  const animateClose = useCallback(() => {
    const menu = ref.current;
    if (!menu) return;

    const anim = menu.animate(
      {
        scale: [1, 0.95],
        opacity: [1, 0],
      },
      AnimOptions
    );

    anim.finished.then(() => {
      onClose();
    });

    return anim;
  }, [onClose]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    if (open && near) {
      const nearRect = near.getBoundingClientRect();
      const refRect = ref.current.getBoundingClientRect();
      setStyle({
        top: `${nearRect.y - refRect.height - 8 + window.pageYOffset}px`,
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
      const anim = animateClose();
      return () => {
        anim?.cancel();
      };
    }
  }, [near, open, animateClose]);

  function handleBlur(e: React.FocusEvent) {
    if (ref.current && !ref.current.contains(e.relatedTarget)) {
      // if focus moved outside, close
      animateClose();
    }
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    animateClose();

    console.log("Clicked menu!");
  }

  return createPortal(
    <div
      className={cx("Menu")}
      tabIndex={-1}
      ref={ref}
      style={style}
      onBlur={handleBlur}
      onClick={handleClick}
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
