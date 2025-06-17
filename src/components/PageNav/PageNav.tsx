import { animateMove } from "./animate";
import "./PageNav.css";
import { PageNavButton } from "./PageNavButton";
import { DropTarget, Rect } from "./types";

function isInsideRect(event: PointerEvent, rect: Rect): boolean {
  const { clientX, clientY } = event;
  return (
    clientX >= rect.x &&
    clientX <= rect.x + rect.width &&
    clientY >= rect.y &&
    clientY <= rect.y + rect.height
  );
}

function cloneForDragAvatar(original: HTMLElement): HTMLElement {
  const clone = original.cloneNode(true) as HTMLElement;

  // Remove all IDs to avoid conflicts
  if (clone.id) clone.removeAttribute("id");
  clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));

  clone.classList.add("drag-avatar");

  return clone;
}

function showAt(el: HTMLElement, e: { clientX: number; clientY: number }) {
  el.style.left = `${e.clientX}px`;
  el.style.top = `${e.clientY}px`;
}

function onDown(
  downEvent: React.PointerEvent<HTMLElement>,
  onChangePageOrder: (id: string[]) => void
) {
  downEvent.preventDefault();

  const target = downEvent.target as HTMLElement;
  if (!target) return;

  // TODO: handle scrolled page offset
  // const startX = e.clientX;
  // const startY = e.clientY;

  let dropTargets: null | DropTarget[] = null;
  let isDrag = false;

  const pageNav = target.closest(".PageNav") as HTMLDivElement;
  const draggedButton = target.closest(".PageNavButton") as HTMLDivElement;
  if (!pageNav || !draggedButton) return;

  let avatar: HTMLElement | null;

  pageNav.setPointerCapture(downEvent.pointerId);

  function cleanUp() {
    if (avatar) document.body.removeChild(avatar);
    draggedButton.style.visibility = "";

    pageNav.removeEventListener("pointermove", onMove);
    pageNav.removeEventListener("pointerup", onUp);
  }

  function onUp(e: PointerEvent) {
    pageNav.releasePointerCapture(e.pointerId);

    if (!isDrag) {
      console.info(">>> click");
      // TODO: if no movement, treat as button click
    } else {
      console.info(">>> drop", dropTargets);
      // Pull new order from current DOM layout to tell React about the change
      const newIdOrder = (
        Array.from(pageNav.querySelectorAll(".PageNavButton")) as HTMLElement[]
      ).map((el) => el.dataset["id"]!);
      onChangePageOrder(newIdOrder);
    }

    cleanUp();
  }

  function initDropTargetsAndSpacer() {
    if (dropTargets !== null) return;

    // Create drag avatar to follow pointer
    avatar = cloneForDragAvatar(draggedButton);
    document.body.appendChild(avatar);

    showAt(avatar, downEvent);

    // Hide original button, but still take up space
    draggedButton.style.visibility = "hidden";

    const buttons = Array.from(
      pageNav.querySelectorAll(".PageNavButton")
    ) as HTMLElement[];
    if (!buttons.length) return;
    const buttonRects = buttons.map((b) => b.getBoundingClientRect());

    // Init drop targets with initial one BEFORE the first button
    const first = buttonRects[0];
    dropTargets = [
      {
        x: first.left - first.width / 2,
        y: first.y,
        width: first.width,
        height: first.height,
        position: "before",
        refNode: buttons[0],
      },
    ];

    // Create drop target BETWEEN every existing button
    for (let i = 1; i < buttonRects.length; i++) {
      const a = buttonRects[i - 1];
      const b = buttonRects[i];

      const left = a.left + a.width / 2;
      const right = b.left + b.width / 2;

      dropTargets.push({
        x: left,
        y: a.y,
        width: right - left,
        height: a.height,
        position: "before",
        refNode: buttons[i],
      });
    }

    // end drop targets with one AFTER the last button
    const last = buttonRects[buttonRects.length - 1];
    dropTargets.push({
      x: last.left + last.width / 2,
      y: last.y,
      width: first.width,
      height: first.height,
      position: "after",
      refNode: buttons[buttons.length - 1],
    });

    // dropTargets.forEach((dt) => debugRect(dt));
  }

  let currentTarget: null | DropTarget = null;

  function moveDraggedButton(dropTarget: DropTarget) {
    const allButtons = Array.from(
      pageNav.querySelectorAll(".PageNavButton")
    ) as HTMLElement[];

    // All buttons positions before the move
    const beforeRects = allButtons.map((el) => el.getBoundingClientRect());

    // Insert the button in new location. This won't display yet until we capture the new/after
    // rects and start the animation
    const parent = dropTarget.refNode.parentNode!;
    parent.insertBefore(
      draggedButton,
      dropTarget.position === "before"
        ? dropTarget.refNode
        : dropTarget.refNode.nextElementSibling
    );

    // Force reflow to get button positions after the move
    void pageNav.offsetTop;
    const afterRects = allButtons.map((el) => el.getBoundingClientRect());

    // Animate all nodes that need to move to new visual positions
    for (let i = 0; i < beforeRects.length; i++) {
      const button = allButtons[i];
      const before = beforeRects[i];
      const after = afterRects[i];

      animateMove(button, before, after);
    }
  }

  function onMove(e: PointerEvent) {
    initDropTargetsAndSpacer();
    if (!dropTargets || !avatar) return;

    void e;
    isDrag = true;
    showAt(avatar, e);

    for (const dropTarget of dropTargets) {
      if (isInsideRect(e, dropTarget)) {
        const oldDropTarget = currentTarget;
        currentTarget = dropTarget;

        if (
          oldDropTarget?.refNode !== currentTarget.refNode ||
          oldDropTarget?.position !== currentTarget.position
        ) {
          moveDraggedButton(currentTarget);
        }

        return;
      }
    }

    // Not over drop target.
    currentTarget = null;
  }

  pageNav.addEventListener("pointerup", onUp);
  pageNav.addEventListener("pointermove", onMove);
}

export interface PageInfo {
  id: string;
  label: string;
  href: string;
}

interface Props {
  pages: PageInfo[];
  onPagesChange: (pages: PageInfo[]) => unknown;
}

export function PageNav({ pages, onPagesChange }: Props) {
  function handlePointerDown(e: React.PointerEvent<HTMLElement>) {
    /**
     * @param ids New order of page IDs to rerender.
     */
    function handleChangePageOrder(ids: string[]) {
      const pageMap = new Map(pages.map((page) => [page.id, page]));
      const newPages = ids.map((id) => pageMap.get(id)!);
      onPagesChange(newPages);
    }

    onDown(e, handleChangePageOrder);
  }

  return (
    <div className="PageNav">
      {pages.map((page) => (
        <PageNavButton
          key={page.id}
          id={page.id}
          label={page.label}
          href={page.href}
          onPointerDown={handlePointerDown}
        />
      ))}
    </div>
  );
}
