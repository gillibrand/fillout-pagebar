import { useCallback, useState } from "react";
import "./App.css";
import { PageNav } from "@components/PageNav";
import { PageInfo } from "@components/PageNav/PageNav";

const initialPages: PageInfo[] = [
  { id: "1", label: "Info", href: "#/info" },
  { id: "2", label: "Details", href: "#/detail" },
  { id: "3", label: "Other", href: "#/other" },
  { id: "4", label: "Ending", href: "#/ending" },
];

function App() {
  const [pages, setPages] = useState(initialPages);

  const handlePagesChange = useCallback((newPages: PageInfo[]) => {
    console.info(">>> newPages", newPages);
    setPages(newPages);
  }, []);

  return (
    <main className="App">
      <PageNav pages={pages} onPagesChange={handlePagesChange} />
    </main>
  );
}

export default App;
