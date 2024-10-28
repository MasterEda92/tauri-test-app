import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./components/layout/Sidebar";
import { ClassList } from "./components/classes/ClassList";
import { SubjectList } from "./components/subjects/SubjectList";

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <div>
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <header className="border-b border-gray-200 dark:border-gray-800 p-4">
            <div className="flex justify-end">
              <Button variant="ghost" onClick={toggleDarkMode}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </header>
          <main className="m-4 flex-1">
            <Routes>
              <Route path="/" element={<ClassList />} />
              <Route path="/subjects" element={<SubjectList />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;