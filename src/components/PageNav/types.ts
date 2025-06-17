export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * A logical location to drop something during DnD. Can be compared to the location
 * of a move event and tracks the element the target is relative to.
 */
export interface DropTarget extends Rect {
  /**
   * Whether this rect is before or after the ref node.
   */
  position: Position;

  /**
   * The element to drop relative to.
   */
  refNode: HTMLElement;
}

export type Position = "after" | "before";

export function debugRect(r: Rect) {
  const el = document.createElement("div");

  Object.assign(el.style, {
    position: "absolute",
    top: `${r.y}px`,
    left: `${r.x}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    backgroundColor: "rgba(255 0 0 / .33)",
    outline: "solid 1px red",
    pointerEvents: "none",
  });

  document.body.appendChild(el);
  setTimeout(() => {
    document.body.removeChild(el);
  }, 500);
}
