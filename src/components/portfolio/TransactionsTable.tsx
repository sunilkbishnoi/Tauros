
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { Portfolio, Transaction } from "@/types/portfolio";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/formatters";
import { Search, ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TransactionsTableProps {
  portfolio: Portfolio;
}

export function TransactionsTable({ portfolio }: TransactionsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionToDelete, setTransactionToDelete] = useState<{
    portfolioId: string;
    holdingId: string;
    transactionId: string;
    assetName: string;
  } | null>(null);
  
  const { removeTransaction } = usePortfolioStore();
  const { toast } = useToast();

  // Flatten all transactions from all holdings
  const allTransactions = portfolio.holdings.flatMap(holding => 
    holding.transactions.map(transaction => ({
      ...transaction,
      holdingId: holding.id,
      assetSymbol: holding.asset.symbol,
      assetName: holding.asset.name,
    }))
  );

  // Sort transactions by date (newest first)
  const sortedTransactions = [...allTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter transactions based on search query
  const filteredTransactions = sortedTransactions.filter(transaction => 
    transaction.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.assetSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteTransaction = () => {
    if (transactionToDelete) {
      const { portfolioId, holdingId, transactionId, assetName } = transactionToDelete;
      removeTransaction(portfolioId, holdingId, transactionId);
      
      toast({
        description: `Transaction for ${assetName} has been deleted`,
      });
      
      setTransactionToDelete(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 opacity-50" />
          <Input 
            placeholder="Search transactions..." 
            className="h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold">
                          {transaction.assetSymbol.toUpperCase()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.assetName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        transaction.type === 'buy' 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {transaction.type === 'buy' ? (
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                        )}
                        {transaction.type.toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(transaction.price, portfolio.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.quantity.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 8
                      })}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transaction.price * transaction.quantity, portfolio.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTransactionToDelete({
                          portfolioId: portfolio.id,
                          holdingId: transaction.holdingId,
                          transactionId: transaction.id,
                          assetName: transaction.assetName,
                        })}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No transactions found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <AlertDialog
        open={transactionToDelete !== null}
        onOpenChange={(open) => !open && setTransactionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This will update your average purchase price and holdings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTransaction}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
