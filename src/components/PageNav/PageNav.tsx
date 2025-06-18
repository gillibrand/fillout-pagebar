import { useAnimateReorder } from "@hooks/useAnimateReorder";
import { ReactElement, useRef } from "react";
import { HoverSeparator } from "./HoverSeparator";
import "./PageNav.css";
import { PageNavButton } from "./PageNavButton";
import { DropTarget } from "./types";
import { cloneForDragAvatar, isInsideRect, showAt } from "./drag-util";

const ThresholdPx = 5;

/**
 *
 *
 * @param downEvent Mouse down event. Can be a click or drag, but don't know yet until mouse moves
 * or goes up.
 * @param onReorder Callback during DnD to reorder the pages. This callback will update the React
 * state as we drag. Gets the new order of the page IDs.
 * @param onPageChange Callback if a known click happens that can directly change the page. Get ID
 * of clicked page.
 */
function onDown(
  downEvent: React.PointerEvent<HTMLElement>,
  onReorder: (id: string[]) => unknown,
  onPageChange: (id: string) => unknown
) {
  downEvent.preventDefault();

  const target = downEvent.target as HTMLElement;
  if (!target) return;

  // TODO: handle scrolled page offset
  const startX = downEvent.clientX;

  // Only count it as a drag if past ThresholdPx, otherwise it's a wiggly click
  let overThreshold = false;

  let dropTargets: null | DropTarget[] = null;
  let isDrag = false;

  const pageNav = target.closest(".PageNav") as HTMLDivElement;
  const clickedButton = target.closest(".PageNavButton") as HTMLDivElement;
  if (!pageNav || !clickedButton) return;
  let avatar: HTMLElement | null;

  (clickedButton.querySelector(".PageNavButton__link") as HTMLElement)?.focus();

  // Lock pointer to this drag and allow moving off page
  pageNav.setPointerCapture(downEvent.pointerId);

  /**
   * Must call after mouseup or other abort to clean up any transient event listeners, etc.
   */
  function cleanUp() {
    if (avatar) document.body.removeChild(avatar);
    clickedButton.classList.remove("invisible");

    pageNav.removeEventListener("pointermove", onMove);
    pageNav.removeEventListener("pointerup", onUp);
  }

  /**
   * Callback when mouse is released. Might count as a click or end a drag.
   */
  function onUp(e: PointerEvent) {
    pageNav.releasePointerCapture(e.pointerId);

    if (!isDrag) {
      const clickedId = clickedButton.dataset.pageId!;
      onPageChange(clickedId);
    } else {
      // we moved and updated state during the drag itself, so nothing left to do.
    }

    cleanUp();
  }

  /**
   * At the start of a drag operation we capture the bounding rect for every existing button.
   * The rects are shifted so they are actually between every button. When dragging, we just compare
   * the mouse location to the drop target refs. We don't want use mouseover like events since they require
   * real DOM nodes, but are targets are not DOM nodes (again, since they are between buttons).
   */
  function initDropTargets() {
    if (dropTargets !== null) return;

    // Create drag avatar to follow pointer
    avatar = cloneForDragAvatar(clickedButton);
    document.body.appendChild(avatar);

    showAt(avatar, downEvent);

    // Hide original button, but still take up space
    clickedButton.classList.add("invisible");

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
        insertAt: 0,
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
        insertAt: i,
      });
    }

    // end drop targets with one AFTER the last button
    const last = buttonRects[buttonRects.length - 1];
    dropTargets.push({
      x: last.left + last.width / 2,
      y: last.y,
      width: first.width,
      height: first.height,
      insertAt: buttonRects.length,
    });
  }

  /** Drop target we are currently over. */
  let currentTarget: null | DropTarget = null;

  /**
   * Figures out the new order of page IDs based on the current drop target. Fire the `onReorder` callback.
   * @param dropTarget The drop target we're over and dropped on.
   */
  function reorderDraggedButton(dropTarget: DropTarget) {
    const clickedId = clickedButton.dataset.pageId!;

    const oldIds = (
      Array.from(pageNav.querySelectorAll(".PageNavButton")) as HTMLElement[]
    ).map((el) => el.dataset.pageId!);

    const oldIndex = oldIds.indexOf(clickedId);
    if (oldIndex === -1) return;

    const newIds = [...oldIds];
    newIds.splice(oldIndex, 1);
    newIds.splice(dropTarget.insertAt, 0, clickedId);

    onReorder(newIds);
  }

  /**
   * Callback when the mouse moves. This will determine if we're far enough to consider this a drag
   * and then start reordering on move if so.
   * @param e Move event.
   */
  function onMove(e: PointerEvent) {
    if (!overThreshold) {
      if (Math.abs(e.clientX - startX) > ThresholdPx) {
        overThreshold = true;
      } else {
        // not moved far enough
        return;
      }
    }

    initDropTargets();
    if (!dropTargets || !avatar) return;

    isDrag = true;
    showAt(avatar, e);

    for (const dropTarget of dropTargets) {
      if (isInsideRect(e, dropTarget)) {
        const oldDropTarget = currentTarget;
        currentTarget = dropTarget;

        if (oldDropTarget?.insertAt !== currentTarget.insertAt) {
          reorderDraggedButton(currentTarget);
        }

        // bail after finding the target we're over whether same or diff
        return;
      }
    }

    // Not over any drop target
    currentTarget = null;
  }

  pageNav.addEventListener("pointerup", onUp);
  pageNav.addEventListener("pointermove", onMove);
}

/**
 * Props to create a page in the bar.
 */
export interface PageInfo {
  id: string;
  label: string;
  href: string;
  /** Custom icon. Uses doc icon if not provided. */
  icon?: ReactElement;
}

interface Props {
  pages: PageInfo[];
  activePageId: string;
  onPagesChange: (pages: PageInfo[]) => unknown;
  onPageClick: (id: string) => unknown;
}

export function PageNav({
  pages,
  onPagesChange,
  onPageClick,
  activePageId,
}: Props) {
  function handlePointerDown(e: React.PointerEvent<HTMLElement>) {
    /**
     * @param ids New order of page IDs to rerender.
     */
    function handleReorder(ids: string[]) {
      const pageMap = new Map(pages.map((page) => [page.id, page]));
      const newPages = ids.map((id) => pageMap.get(id)!);
      onPagesChange(newPages);
    }

    onDown(e, handleReorder, onPageClick);
  }

  const buttons = [];

  for (const page of pages) {
    if (buttons.length) {
      buttons.push(<HoverSeparator key={`sep-${page.id}`} />);
    }

    buttons.push(
      <PageNavButton
        key={page.id}
        id={page.id}
        label={page.label}
        href={page.href}
        onPointerDown={handlePointerDown}
        // onPointerUp={handlePointerUp}
        onClick={onPageClick}
        isActive={page.id === activePageId}
        icon={page.icon}
      />
    );
  }

  const parentRef = useRef<HTMLDivElement>(null);

  useAnimateReorder(parentRef, ".PageNavButton", "pageId");

  return (
    <div className="PageNav" ref={parentRef}>
      {buttons}
    </div>
  );
}
