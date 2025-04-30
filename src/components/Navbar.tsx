
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./navbar/SearchBar";
import { MobileMenu } from "./navbar/MobileMenu";
import { CurrencyToggle } from "./navbar/CurrencyToggle";
import { LogoAnimation } from "./LogoAnimation";
import { NavLinks } from "./navbar/NavLinks";
import { ProfileMenu } from "./navbar/ProfileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";

export function Navbar({ onCurrencyChange }: { onCurrencyChange?: (currency: 'INR' | 'USD') => void }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Left section with logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <LogoAnimation />
          </Link>
        </div>
        
        {/* Center section with navigation */}
        <div className="flex-1 hidden md:flex justify-center">
          <NavLinks />
        </div>
        
        {/* Right section with actions */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <SearchBar />
          {!isMobile && <CurrencyToggle onCurrencyChange={onCurrencyChange} />}
          <ThemeToggle />
          
          {location.pathname !== "/login" && (
            <Button variant="ghost" size="sm" asChild className="hidden md:flex items-center">
              <Link to="/login">
                <LogIn className="mr-1 h-4 w-4" /> Login
              </Link>
            </Button>
          )}
          
          <div className="ml-1">
            <ProfileMenu />
          </div>
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
