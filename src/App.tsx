import { useCallback, useState } from "react";
import "./App.css";
import { PageNav } from "@components/PageNav";
import { PageInfo } from "@components/PageNav/PageNav";

import Info from "@icons/info.svg?react";
import Check from "@icons/check.svg?react";
import Flag from "@icons/flag.svg?react";
import Rename from "@icons/edit.svg?react";
import Duplicate from "@icons/copy.svg?react";
import Delete from "@icons/delete.svg?react";
import Paste from "@icons/paste.svg?react";

import { Menu, MenuItem } from "@components/Menu/Menu";

const initialPages: PageInfo[] = [
  { id: "1", label: "Info", href: "#/info", icon: <Info /> },
  { id: "2", label: "Details", href: "#/detail" },
  { id: "3", label: "Other", href: "#/other" },
  { id: "4", label: "Ending", href: "#/ending", icon: <Check /> },
];

const menuItems: MenuItem[] = [
  {
    id: "first",
    label: "Set as first page",
    icon: <Flag />,
    type: "primary",
  },
  {
    id: "rename",
    label: "Rename",
    icon: <Rename />,
  },
  {
    id: "copy",
    label: "Copy",
    icon: <Paste />,
  },
  {
    id: "duplicate",
    label: "Duplicate",
    icon: <Duplicate />,
  },
  {
    id: "delete",
    label: "Delete",
    icon: <Delete />,
    type: "danger",
    isSeparated: true,
  },
];

function App() {
  const [pages, setPages] = useState(initialPages);

  const [activePageId, setActivePageId] = useState(pages[0].id);

  const handlePagesChange = useCallback((newPages: PageInfo[]) => {
    setPages(newPages);
  }, []);

  function handlePageClick(id: string) {
    setActivePageId(id);
  }

  return (
    <main className="App">
      <Menu heading="Settings" items={menuItems} />

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
