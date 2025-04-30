
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Portfolio } from "@/types/portfolio";
import { formatCurrency } from "@/utils/formatters";

interface PortfolioListProps {
  portfolios: Portfolio[];
  activePortfolioId: string | null;
  onSelectPortfolio: (id: string) => void;
}

export function PortfolioList({ portfolios, activePortfolioId, onSelectPortfolio }: PortfolioListProps) {
  const handlePortfolioChange = (value: string) => {
    onSelectPortfolio(value);
  };

  const activePortfolio = portfolios.find(p => p.id === activePortfolioId);
  
  return (
    <div className="w-full sm:max-w-xs">
      <Select value={activePortfolioId || ''} onValueChange={handlePortfolioChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a portfolio" />
        </SelectTrigger>
        <SelectContent>
          {portfolios.map((portfolio) => (
            <SelectItem 
              key={portfolio.id} 
              value={portfolio.id}
              className="flex justify-between"
            >
              <div className="flex items-center justify-between w-full">
                <span>{portfolio.name}</span>
                <span className="text-sm text-muted-foreground ml-4">
                  {formatCurrency(portfolio.totalValue, portfolio.currency)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
