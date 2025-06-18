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

  return (
    <main className="App">
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
