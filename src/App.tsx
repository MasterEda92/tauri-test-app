import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/layout/Sidebar";
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
      <SidebarProvider defaultOpen>
        <div className="flex w-full h-screen overflow-hidden bg-gray-950">
          <AppSidebar />
          <main className="flex-1 items-center flex flex-col h-full">
            <div className="flex flex-col w-full h-full">
              <header className="border-b border-gray-200 dark:border-gray-800 p-4">
                <div className="flex justify-end items-center px-4">
                  <SidebarTrigger className="mr-auto" />
                  <Button variant="ghost" onClick={toggleDarkMode}>
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                </div>
              </header>
              <div className="flex-1 overflow-y-auto">
                <div className="flex justify-center min-h-full">
                  <div className="w-7/12 py-6">
                    <Routes>
                      <Route path="/" element={<ClassList />} />
                      <Route path="/subjects" element={<SubjectList />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;