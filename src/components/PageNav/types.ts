export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * A logical location to drop something during DnD. These are "positioned" where drops occur (they
 * are not in the DOM, we just check the coords). When dropped on, they know the position to drop at.
 */
export interface DropTarget extends Rect {
  /**
   * Zero based index of where to insert after a drag and drop. This can be used during drag and drop to update as we go.
   */
  insertAt: number;
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
