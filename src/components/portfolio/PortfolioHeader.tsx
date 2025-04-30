
import { ArrowUpDown } from "lucide-react";

export function PortfolioHeader() {
  return (
    <header className="mb-8">
      <div className="relative">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary/50 text-primary-foreground py-2 px-6 transform skew-x-12 inline-block shadow-[3px_3px_0px_rgb(0_0_0/0.3)]">
          <span className="transform -skew-x-12 inline-block">Portfolio Tracker</span>
        </h1>
        <div className="absolute -bottom-2 right-0 w-12 h-1 bg-primary/70 transform skew-x-12"></div>
      </div>
      <p className="text-muted-foreground mt-5 flex items-center">
        <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
        Track and analyze your investments in one place
      </p>
    </header>
  );
}
