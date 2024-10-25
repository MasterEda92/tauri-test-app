import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react" // Icons importieren
import { Input } from "./components/ui/input";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Prüfe beim Start, ob das System Dark Mode verwendet
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="flex flex-col items-center m-2 p-2">
      <div className="m-2 p-2">
         <h1>Welcome to Tauri + React</h1>
      </div>
      <div className="m-2 p-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <div className="flex flex-row gap-2">
            <Input
            
              id="greet-input"
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Enter a name..."
            />
            <Button type="submit">Greet</Button>
          </div>
          
        </form>        
      </div>
      <div className="m-2 p-2">
        <p>{greetMsg}</p>
      </div>
      <div className="m-2 p-2">
        <Button variant="ghost" onClick={toggleDarkMode}>
          <div className="flex flex-row gap-2">
            <p>Toggle</p>  
            <div>
              {isDark ? <Sun /> : <Moon />}
            </div>
          </div>
        </Button>
      </div>      
    </main>
  );
}

export default App;
