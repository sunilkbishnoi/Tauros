import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PortfolioPerformance } from "@/components/portfolio/PortfolioPerformance";
import { HoldingsList } from "@/components/portfolio/HoldingsList";
import { TransactionsTable } from "@/components/portfolio/TransactionsTable";
import { AddHoldingDialog } from "@/components/portfolio/AddHoldingDialog";
import { AddTransactionDialog } from "@/components/portfolio/AddTransactionDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Download, Share, Edit, Plus, Trash, ArrowLeft, Calendar, TrendingUp, Briefcase, ChevronRight, AlertTriangle } from "lucide-react";
import { Portfolio, PortfolioHolding } from "@/types/portfolio";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectItem } from "@/components/ui/select-custom";

export default function PortfolioDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { portfolios, deletePortfolio } = usePortfolioStore();
  const portfolio = portfolios.find(p => p.id === id);
  
  const [addHoldingOpen, setAddHoldingOpen] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState<PortfolioHolding | null>(null);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  useEffect(() => {
    if (id && !portfolio) {
      toast({
        title: "Portfolio not found",
        description: "The requested portfolio could not be found",
        variant: "destructive"
      });
      navigate("/portfolio");
    }
  }, [id, portfolio, navigate, toast]);
  
  const handleDeletePortfolio = () => {
    if (id) {
      deletePortfolio(id);
      toast({
        description: "Portfolio deleted successfully"
      });
      navigate("/portfolio");
    }
  };
  
  const openAddTransactionDialog = (holding: PortfolioHolding) => {
    setSelectedHolding(holding);
    setAddTransactionOpen(true);
  };
  
  if (!portfolio) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to="/portfolio" className="flex items-center hover:text-foreground transition-colors">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Portfolios
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{portfolio.name}</h1>
                <Badge variant="outline" className="text-xs font-normal">Active</Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {new Date(portfolio.lastUpdated).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export portfolio data as CSV</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Share className="h-4 w-4" />
                      Share
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share portfolio with others</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="default" size="sm" className="gap-1">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit portfolio details</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteConfirmOpen(true)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete portfolio</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="neo-brutal-card">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <Briefcase className="h-5 w-5 text-primary/70" />
                </div>
                <div className="text-2xl font-bold">${portfolio.totalValue.toLocaleString()}</div>
                <div className="mt-2 text-xs flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>As of {new Date().toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="neo-brutal-card">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-muted-foreground">Today</span>
                  <TrendingUp className={`h-5 w-5 ${portfolio.performance.today >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                </div>
                <div className={`text-2xl font-bold ${portfolio.performance.today >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolio.performance.today >= 0 ? '+' : ''}{portfolio.performance.today}%
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {portfolio.performance.today >= 0 ? 'Up' : 'Down'} from yesterday
                </div>
              </CardContent>
            </Card>
            
            <Card className="neo-brutal-card">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-muted-foreground">Monthly</span>
                  <TrendingUp className={`h-5 w-5 ${portfolio.performance.month >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                </div>
                <div className={`text-2xl font-bold ${portfolio.performance.month >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolio.performance.month >= 0 ? '+' : ''}{portfolio.performance.month}%
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {portfolio.performance.month >= 0 ? 'Up' : 'Down'} from last month
                </div>
              </CardContent>
            </Card>
            
            <Card className="neo-brutal-card">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-muted-foreground">All-Time</span>
                  <TrendingUp className={`h-5 w-5 ${portfolio.performance.allTime >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                </div>
                <div className={`text-2xl font-bold ${portfolio.performance.allTime >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolio.performance.allTime >= 0 ? '+' : ''}{portfolio.performance.allTime}%
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {portfolio.performance.allTime >= 0 ? 'Growth' : 'Loss'} since inception
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setAddHoldingOpen(true)}>
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Add New Holding</h3>
                  <p className="text-sm text-muted-foreground">Track a new asset in your portfolio</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("analytics")}>
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">View Analytics</h3>
                  <p className="text-sm text-muted-foreground">See detailed performance metrics</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("transactions")}>
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Transaction History</h3>
                  <p className="text-sm text-muted-foreground">Review your past transactions</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="holdings">Holdings</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 animate-fadeIn">
              <PortfolioPerformance portfolio={portfolio} />
              
              {portfolio.holdings.length === 0 && (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium">Start Building Your Portfolio</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Add your first investment to get started with tracking your portfolio's performance.
                    </p>
                    <Button 
                      onClick={() => setAddHoldingOpen(true)}
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Holding
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="holdings" className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Holdings</h3>
                <Button 
                  className="gap-1"
                  onClick={() => setAddHoldingOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Holding
                </Button>
              </div>
              <HoldingsList 
                portfolio={portfolio} 
                onAddTransaction={openAddTransactionDialog}
              />
            </TabsContent>
            
            <TabsContent value="transactions" className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Transactions</h3>
                {portfolio.holdings.length > 0 ? (
                  <div className="flex gap-2">
                    <Select
                      triggerClassName="w-40"
                      placeholder="Select holding"
                      onValueChange={(value) => {
                        const holding = portfolio.holdings.find(h => h.id === value);
                        if (holding) {
                          openAddTransactionDialog(holding);
                        }
                      }}
                    >
                      {portfolio.holdings.map(holding => (
                        <SelectItem key={holding.id} value={holding.id}>
                          {holding.asset.symbol.toUpperCase()}
                        </SelectItem>
                      ))}
                    </Select>
                    <Button className="gap-1" disabled={portfolio.holdings.length === 0}>
                      <Plus className="h-4 w-4" />
                      New Transaction
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="gap-1"
                    onClick={() => setAddHoldingOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add Holding First
                  </Button>
                )}
              </div>
              <TransactionsTable portfolio={portfolio} />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Analytics</h3>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Asset Allocation</h4>
                      <div className="aspect-square rounded-lg bg-muted/50 flex items-center justify-center">
                        <p className="text-center text-muted-foreground">Asset allocation chart will be shown here</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Performance by Asset</h4>
                      <div className="aspect-square rounded-lg bg-muted/50 flex items-center justify-center">
                        <p className="text-center text-muted-foreground">Performance chart will be shown here</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="font-medium mb-4">Investment Insights</h4>
                    
                    {portfolio.holdings.length > 0 ? (
                      <div className="space-y-4">
                        {portfolio.holdings.map(holding => {
                          const returnPercentage = holding.return.percentage;
                          let insight = "";
                          let color = "text-blue-500";
                          
                          if (returnPercentage >= 15) {
                            insight = "Consider taking profits or rebalancing your position.";
                            color = "text-green-500";
                          } else if (returnPercentage <= -10) {
                            insight = "Consider averaging down if you believe in the long-term potential.";
                            color = "text-red-500";
                          } else if (returnPercentage > 0) {
                            insight = "This position is performing well. Monitor market conditions for optimal exit points.";
                            color = "text-green-500";
                          } else {
                            insight = "This position needs attention. Review your investment thesis.";
                            color = "text-amber-500";
                          }
                          
                          return (
                            <div key={holding.id} className="border rounded-md p-4">
                              <div className="flex justify-between items-center mb-2">
                                <div className="font-medium">{holding.asset.name} ({holding.asset.symbol.toUpperCase()})</div>
                                <div className={`${returnPercentage >= 0 ? 'text-green-500' : 'text-red-500'} font-semibold`}>
                                  {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <AlertTriangle className={`h-4 w-4 mt-0.5 ${color}`} />
                                <p className="text-sm">{insight}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        Add holdings to see investment insights
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      
      {portfolio && (
        <AddHoldingDialog
          open={addHoldingOpen}
          onOpenChange={setAddHoldingOpen}
          portfolioId={portfolio.id}
          currency={portfolio.currency}
        />
      )}
      
      {selectedHolding && (
        <AddTransactionDialog
          open={addTransactionOpen}
          onOpenChange={setAddTransactionOpen}
          portfolioId={portfolio.id}
          holding={selectedHolding}
        />
      )}
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{portfolio.name}" portfolio and all its data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePortfolio}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
