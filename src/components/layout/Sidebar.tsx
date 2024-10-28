import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { BookOpen, GraduationCap, Calendar, Settings } from "lucide-react";
import { ChalkboardTeacher } from "@phosphor-icons/react";

const stammdaten = [
  {
    name: "Klassen",
    href: "/",
    icon: GraduationCap
  },
  {
    name: "Fächer",
    href: "/subjects",
    icon: BookOpen
  }
];

const planung = [
  {
    name: "Stundenplan",
    href: "/timetable",
    icon: Calendar
  }
]

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex flex-row justify-start items-center gap-3 p-2">
          <ChalkboardTeacher 
            
            className="text-4xl text-primary hover:text-primary/80 transition-colors" 
          />
          <p className="text-2xl">Planedo</p>
        </div>        
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Stammdaten</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {stammdaten.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.href}
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Planung</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {planung.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.href}
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === '/settings'}
            >
              <Link to='/settings'>
                <Settings className="h-4 w-4" />
                <span>Einstellungen</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
            </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}