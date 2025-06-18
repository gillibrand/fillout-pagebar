import { PageNav } from "@components/PageNav";
import { PageInfo } from "@components/PageNav/PageNav";
import { useCallback, useState } from "react";
import "./App.css";

import Check from "@icons/check.svg?react";
import Info from "@icons/info.svg?react";

const initialPages: PageInfo[] = [
  { id: "1", label: "Info", href: "#/info", icon: <Info /> },
  { id: "2", label: "Details", href: "#/detail" },
  { id: "3", label: "Other", href: "#/other" },
  { id: "4", label: "Ending", href: "#/ending", icon: <Check /> },
];

function App() {
  const [pages, setPages] = useState(initialPages);

  const [activePageId, setActivePageId] = useState(pages[0].id);

  const handlePagesChange = useCallback(
    (newPages: PageInfo[]) => {
      // bit of a hack to activate the first new page id in the new set that wasn't there before.
      const newIds = new Set(newPages.map((page) => page.id));
      pages.forEach((oldPage) => newIds.delete(oldPage.id));

      for (const newId of newIds) {
        setActivePageId(newId);
        break;
      }

      setPages(newPages);
    },
    [pages]
  );

  function handlePageClick(id: string) {
    setActivePageId(id);
  }

  function getPageText() {
    if (activePageId === "1") {
      return (
        <>
          <h1>Info</h1>
          <p>
            Hi, I'm <a href="https://gillibrand.github.io/projects/">Jay</a>.
            Thanks for reviewing my submission.
          </p>

          <h2>Assumptions</h2>

          <ul>
            <li>
              Focus ring should always be visible on keyboard (:focus-visible)
              access. Use <kbd>Tab</kbd> to move between tabs.
            </li>
            <li>
              Space should always be reserved for the <kbd>︙</kbd> (more) menu
              button to prevent the tabs from resizing.
            </li>
            <li>
              Add Tab buttons should only show on hover. They are <b>not</b>{" "}
              keyboard accessible here, but should/could be.
            </li>
            <li>
              Actual icons don't matter. I just used similar ones from Material
              Design instead of extracting yours from Figma. Real work would use
              those from Figma or UX handoff in a real project. Similarly I
              rushed though guesses for padding/margin/etc. sizes instead of
              getting them pixel perfect since I assume that's not the point of
              this.
            </li>
          </ul>

          <h2>Implementation</h2>

          <ul>
            <li>
              I just did a custom drag-and-drop implementation since I didn't
              like React DnD in the past. I would investigate alternatives for a
              real projects.
            </li>
            <li>The menu doesn't do anything or support keyboard nav.</li>
            <li>
              I've used private CSS util libraries similar to Tailwind in the
              past, but don't know Tailwind itself well enough for this quick
              project. I just threw any quick-and-dirty CSS at this to power
              through a first pass.
            </li>
          </ul>
        </>
      );
    } else {
      const activePage = pages.find((page) => {
        return page.id === activePageId;
      });
      const pageName = activePage?.label;
      return (
        <>
          <h1>{pageName} page </h1>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit,
            soluta maiores adipisci beatae debitis magnam ipsa iste temporibus a
            incidunt.
          </p>
        </>
      );
    }
  }

  return (
    <main className="App">
      <div className="page-content">
        <div className="wrapper">{getPageText()}</div>
      </div>

      <PageNav
        pages={pages}
        onPagesChange={handlePagesChange}
        activePageId={activePageId}
        onPageClick={handlePageClick}
      />
    </main>
  );
}

export default App;
