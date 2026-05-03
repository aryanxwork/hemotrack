import { Bell, Menu, Moon, Sun, PanelLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

interface Props { title: string; toggleSidebar: () => void; openMobile: () => void; }

export default function Header({ title, toggleSidebar, openMobile }: Props) {
  const { user } = useAuth();
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 glass border-b h-16 flex items-center px-4 md:px-6 gap-4">
      <button onClick={openMobile} className="md:hidden p-2 hover:bg-accent rounded-md">
        <Menu className="w-5 h-5" />
      </button>
      <button onClick={toggleSidebar} className="hidden md:inline-flex p-2 hover:bg-accent rounded-md">
        <PanelLeft className="w-5 h-5" />
      </button>
      <h1 className="font-display text-2xl tracking-wide flex-1 truncate">{title}</h1>
      <button className="p-2 hover:bg-accent rounded-md relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
      </button>
      <button onClick={() => setDark(d => !d)} className="p-2 hover:bg-accent rounded-md">
        {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      {user && (
        <div className="flex items-center gap-2 pl-2 border-l border-border/50">
          <span className="hidden sm:inline text-sm font-medium">{user.username}</span>
          <Badge className="bg-primary/15 text-primary border-primary/30">{user.role}</Badge>
        </div>
      )}
    </header>
  );
}
