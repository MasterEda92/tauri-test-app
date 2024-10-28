import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Settings 
} from "lucide-react";

const navigation = [
  {
    name: "Klassen",
    href: "/",
    icon: GraduationCap
  },
  {
    name: "Fächer",
    href: "/subjects",
    icon: BookOpen
  },
  {
    name: "Stundenplan",
    href: "/timetable",
    icon: Calendar
  },
  {
    name: "Einstellungen",
    href: "/settings",
    icon: Settings
  }
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="h-screen w-64 border-r border-gray-200 dark:border-gray-800">
      <div className="flex flex-col h-full p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  location.pathname === item.href && "bg-muted"
                )}
                asChild
              >
                <Link to={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
