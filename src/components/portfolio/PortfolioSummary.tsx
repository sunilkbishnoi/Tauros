
import { TrendingUp, TrendingDown, PieChart, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/formatters";
import { Portfolio } from "@/types/portfolio";

interface PortfolioSummaryProps {
  portfolio: Portfolio;
}

export function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  // Calculate portfolio stats
  const totalCost = portfolio.holdings.reduce(
    (total, holding) => total + holding.quantity * holding.averageBuyPrice, 
    0
  );
  
  const totalReturn = portfolio.totalValue - totalCost;
  const returnPercentage = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;
  
  // Calculate asset type distribution
  const cryptoValue = portfolio.holdings
    .filter(h => h.asset.type === 'crypto')
    .reduce((total, h) => total + h.value, 0);
    
  const stocksValue = portfolio.holdings
    .filter(h => h.asset.type === 'stock')
    .reduce((total, h) => total + h.value, 0);
    
  const cryptoPercentage = portfolio.totalValue > 0 ? (cryptoValue / portfolio.totalValue) * 100 : 0;
  const stocksPercentage = portfolio.totalValue > 0 ? (stocksValue / portfolio.totalValue) * 100 : 0;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-scaleIn">
      <Card className="neo-brutal-card">
        <CardContent className="p-4 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-foreground">Total Value</span>
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
              <PieChart className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-bold">{formatCurrency(portfolio.totalValue, portfolio.currency)}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {portfolio.holdings.length} {portfolio.holdings.length === 1 ? 'asset' : 'assets'}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="neo-brutal-card">
        <CardContent className="p-4 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-foreground">Total Return</span>
            {returnPercentage >= 0 ? (
              <div className="h-8 w-8 rounded-md bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-md bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
            )}
          </div>
          <div className="mt-2">
            <h2 className={`text-2xl font-bold ${returnPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(totalReturn, portfolio.currency)}
            </h2>
            <p className={`text-sm ${returnPercentage >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
              {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="neo-brutal-card sm:col-span-2">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-muted-foreground">Asset Allocation</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Crypto</span>
                <span>{cryptoPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={cryptoPercentage} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stocks</span>
                <span>{stocksPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={stocksPercentage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
