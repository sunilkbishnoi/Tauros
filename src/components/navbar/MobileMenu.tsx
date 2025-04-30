
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Home, BarChart2, Briefcase, Heart, Newspaper } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Home", path: "/", icon: Home },
    { name: "Markets", path: "/markets", icon: BarChart2 },
    { name: "Portfolio", path: "/portfolio", icon: Briefcase },
    { name: "Favorites", path: "/favorites", icon: Heart },
    { name: "News", path: "/news", icon: Newspaper },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex items-center justify-center p-1 rounded-md">
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="right" hideCloseButton className="w-3/4 sm:w-64 bg-background border-l p-0 max-h-screen overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="px-4 py-2 border-b mb-2">
            <h2 className="text-lg font-bold text-primary">Tauros</h2>
            <p className="text-xs text-muted-foreground">AI-Powered Market Insights</p>
          </div>
          <nav className="flex flex-col space-y-1 p-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-colors hover:bg-secondary ${
                  location.pathname === link.path ? "bg-secondary text-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
