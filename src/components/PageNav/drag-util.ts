import { Rect } from "./types";

export function isInsideRect(event: PointerEvent, rect: Rect): boolean {
  const { clientX, clientY } = event;
  return (
    clientX >= rect.x &&
    clientX <= rect.x + rect.width &&
    clientY >= rect.y &&
    clientY <= rect.y + rect.height
  );
}

export function cloneForDragAvatar(original: HTMLElement): HTMLElement {
  const clone = original.cloneNode(true) as HTMLElement;

  // Remove all IDs to avoid conflicts
  if (clone.id) clone.removeAttribute("id");
  clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));

  clone.classList.add("drag-avatar");

  return clone;
}

export function showAt(
  el: HTMLElement,
  e: { clientX: number; clientY: number },
  dx: number,
  dy: number
) {
  el.style.left = `${e.clientX - dx}px`;
  el.style.top = `${e.clientY - dy}px`;
}
