import { Rect } from "./types";

export function animateMove(el: HTMLElement, before: Rect, after: Rect) {
  if (before.x === after.x && before.y === after.y) return;

  const diffX = before.x - after.x;
  const diffY = after.y - before.y;

  el.animate([{ translate: `${diffX}px ${diffY}px` }, { translate: "0 0" }], {
    duration: 200,
    easing: "ease-in-out",
  });
}
