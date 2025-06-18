import { useCallback, useLayoutEffect, useRef } from "react";

/**
 * Watches for layout changes to element under a parent container. Animates their positions from old
 * to new. Since React is data driven, we can't easily animate something, then update React from it.
 * Instead, this records the layout or a parent parent's children. After a state change this will
 * run again and look at the elements new positions. If they differ it will animate from the old
 * position to the new. This lets us animate easily just by updating React state and having the
 * animation follow along. Similar technique as in the auto-animate package.
 *
 * @param containerRef Parent element to watch to reorder changes.
 * @param elementSelector CSS selector to find the significant elements that will move. Used to
 * compare before and after.
 * @param dataKey The name of the dataset key that is used to ID the elements. We don't use HTML ID
 * since those must be unique on a page. We don't use React key since we can't access that from
 * HTML.
 *
 * @returns Function to refresh its layout cache. This is needed before
 */
export function useAnimateReorder(
  containerRef: React.RefObject<HTMLElement>,
  elementSelector: string,
  dataKey: string
) {
  const previousRectsRef = useRef<Map<string, DOMRect>>(new Map());
  const anims = useRef<Animation[]>([]);

  const getElements = useCallback((): HTMLElement[] => {
    const container = containerRef.current;
    if (!container) return [];

    return Array.from(
      container.querySelectorAll(elementSelector)
    ) as HTMLElement[];
  }, [elementSelector, containerRef]);

  const getRects = useCallback(
    (elements: HTMLElement[]): Map<string, DOMRect> => {
      const rects = new Map();

      for (const el of elements) {
        const key = el.dataset[dataKey];
        if (key) rects.set(key, el.getBoundingClientRect());
      }

      return rects;
    },
    [dataKey]
  );

  //
  const forceUpdate = useCallback(() => {
    const elements = getElements();
    previousRectsRef.current = getRects(elements);
  }, [getRects, getElements]);

  useLayoutEffect(() => {
    const elements = getElements();
    const newRects = getRects(elements);

    // Bail on animation if size is the same. We only animate reorder here, not Add or remove
    if (newRects.size === previousRectsRef.current.size) {
      for (const el of elements) {
        const key = el.dataset[dataKey];
        const oldRect = previousRectsRef.current.get(key!);
        const newRect = newRects.get(key!);

        if (!oldRect || !newRect) continue;

        const dx = oldRect.left - newRect.left;
        const dy = oldRect.top - newRect.top;

        if (dx || dy) {
          const anim = el.animate(
            [
              { transform: `translate(${dx}px, ${dy}px)` },
              { transform: "translate(0, 0)" },
            ],
            {
              duration: 200,
              easing: "ease-in-out",
            }
          );

          anims.current.push(anim);
        }
      }
    }

    previousRectsRef.current = newRects;

    return () => {
      // On cleanup finish all animations. This prevents overlapping animation, plus is expected clean up on unmount
      anims.current.forEach((a) => a.finish());
      anims.current = [];
    };
  });

  return forceUpdate;
}
