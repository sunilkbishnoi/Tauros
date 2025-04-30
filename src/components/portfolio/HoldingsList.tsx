
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Portfolio, PortfolioHolding } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HoldingsListProps {
  portfolio: Portfolio;
  onAddTransaction?: (holding: PortfolioHolding) => void;
}

export function HoldingsList({ portfolio, onAddTransaction }: HoldingsListProps) {
  const [holdingToDelete, setHoldingToDelete] = useState<string | null>(null);
  const { removeHolding } = usePortfolioStore();
  const { toast } = useToast();
  
  const handleDeleteHolding = () => {
    if (holdingToDelete) {
      removeHolding(portfolio.id, holdingToDelete);
      
      toast({
        description: "Holding removed successfully",
      });
      
      setHoldingToDelete(null);
    }
  };
  
  if (portfolio.holdings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 p-3 rounded-full bg-primary/10">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">No holdings yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Start tracking your investments by adding assets to this portfolio.
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Holding
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: portfolio.currency,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg. Buy Price</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Return</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolio.holdings.map((holding) => (
                <TableRow key={holding.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{holding.asset.symbol.toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground">{holding.asset.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{holding.quantity.toFixed(6)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(holding.averageBuyPrice)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(holding.currentPrice)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(holding.value)}</TableCell>
                  <TableCell className="text-right">
                    <div className={`font-medium ${holding.return.percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {holding.return.percentage >= 0 ? '+' : ''}{holding.return.percentage.toFixed(2)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(holding.return.amount)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{holding.allocation.toFixed(2)}%</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => onAddTransaction && onAddTransaction(holding)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Add transaction</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit holding</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => setHoldingToDelete(holding.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove holding</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!holdingToDelete} onOpenChange={(open) => !open && setHoldingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this holding and all its transactions from your portfolio.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteHolding}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
