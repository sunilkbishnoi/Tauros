import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useMarketData, useStockData } from "@/services/cryptoApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Search, CoinsIcon, LineChart } from "lucide-react";

interface AddHoldingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolioId: string;
  currency: string;
}

export function AddHoldingDialog({ 
  open, 
  onOpenChange, 
  portfolioId,
  currency 
}: AddHoldingDialogProps) {
  const [assetType, setAssetType] = useState<'crypto' | 'stock'>('crypto');
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addHolding } = usePortfolioStore();
  const { toast } = useToast();
  const { data: cryptoData, isLoading: cryptoLoading } = useMarketData();
  const { data: stockData, isLoading: stockLoading } = useStockData();
  
  const filteredAssets = assetType === 'crypto'
    ? cryptoData?.filter(crypto => 
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stockData?.filter(stock => 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  const selectedAsset = assetType === 'crypto'
    ? cryptoData?.find(c => c.id === selectedAssetId)
    : stockData?.find(s => s.id === selectedAssetId);
  
  const handleSelectAsset = (id: string) => {
    setSelectedAssetId(id);
    
    const asset = assetType === 'crypto'
      ? cryptoData?.find(c => c.id === id)
      : stockData?.find(s => s.id === id);
      
    if (asset) {
      setBuyPrice(asset.current_price.toString());
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAssetId || !quantity || !buyPrice) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    const asset = assetType === 'crypto'
      ? cryptoData?.find(c => c.id === selectedAssetId)
      : stockData?.find(s => s.id === selectedAssetId);
      
    if (!asset) {
      toast({
        title: "Error",
        description: "Selected asset not found",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addHolding(portfolioId, {
        asset: {
          id: asset.id,
          symbol: asset.symbol,
          name: asset.name,
          type: assetType,
        },
        quantity: parseFloat(quantity),
        averageBuyPrice: parseFloat(buyPrice),
        currentPrice: asset.current_price,
        value: parseFloat(quantity) * asset.current_price,
      });
      
      toast({
        description: `${asset.name} added to your portfolio`,
      });
      
      setSelectedAssetId('');
      setSearchQuery('');
      setQuantity('');
      setBuyPrice('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add asset to portfolio",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Asset to Portfolio</DialogTitle>
          <DialogDescription>
            Search and add a cryptocurrency or stock to your portfolio.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="crypto" onValueChange={(v) => setAssetType(v as 'crypto' | 'stock')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crypto" className="flex items-center tabs-button">
              <CoinsIcon className="mr-2 h-4 w-4" />
              Cryptocurrency
            </TabsTrigger>
            <TabsTrigger value="stock" className="flex items-center tabs-button">
              <LineChart className="mr-2 h-4 w-4" />
              Stock
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="crypto" className="space-y-4 mt-4">
            <div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search cryptocurrencies..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedAssetId('');
                  }}
                />
              </div>
              
              {searchQuery && (
                <div className="mt-2 max-h-[200px] overflow-auto border rounded-md">
                  {cryptoLoading ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Loading...
                    </div>
                  ) : filteredAssets && filteredAssets.length > 0 ? (
                    <div className="p-1">
                      {filteredAssets.slice(0, 5).map((crypto) => (
                        <div
                          key={crypto.id}
                          className={`flex justify-between items-center p-2 cursor-pointer rounded-md ${
                            selectedAssetId === crypto.id ? 'bg-secondary/80' : 'hover:bg-secondary/50'
                          }`}
                          onClick={() => handleSelectAsset(crypto.id)}
                        >
                          <div>
                            <div className="font-semibold">
                              {crypto.symbol.toUpperCase()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {crypto.name}
                            </div>
                          </div>
                          <div className="text-right">
                            <div>{formatPrice(crypto.current_price, currency)}</div>
                            <div className={`text-xs ${
                              crypto.price_change_percentage_24h >= 0 
                                ? 'text-green-500' 
                                : 'text-red-500'
                            }`}>
                              {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                              {crypto.price_change_percentage_24h.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No cryptocurrencies found
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="stock" className="space-y-4 mt-4">
            <div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search stocks..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedAssetId('');
                  }}
                />
              </div>
              
              {searchQuery && (
                <div className="mt-2 max-h-[200px] overflow-auto border rounded-md">
                  {stockLoading ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Loading...
                    </div>
                  ) : filteredAssets && filteredAssets.length > 0 ? (
                    <div className="p-1">
                      {filteredAssets.slice(0, 5).map((stock) => (
                        <div
                          key={stock.id}
                          className={`flex justify-between items-center p-2 cursor-pointer rounded-md ${
                            selectedAssetId === stock.id ? 'bg-secondary/80' : 'hover:bg-secondary/50'
                          }`}
                          onClick={() => handleSelectAsset(stock.id)}
                        >
                          <div>
                            <div className="font-semibold">
                              {stock.symbol.toUpperCase()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {stock.name}
                            </div>
                          </div>
                          <div className="text-right">
                            <div>{formatPrice(stock.current_price, currency)}</div>
                            <div className={`text-xs ${
                              stock.price_change_percentage_24h >= 0 
                                ? 'text-green-500' 
                                : 'text-red-500'
                            }`}>
                              {stock.price_change_percentage_24h >= 0 ? '+' : ''}
                              {stock.price_change_percentage_24h.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No stocks found
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {selectedAsset && (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex p-3 rounded-md bg-secondary/50">
                <div className="flex-1">
                  <p className="font-semibold">{selectedAsset.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedAsset.symbol.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(selectedAsset.current_price, currency)}</p>
                  <p className={`text-sm ${
                    selectedAsset.price_change_percentage_24h >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {selectedAsset.price_change_percentage_24h >= 0 ? '+' : ''}
                    {selectedAsset.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buyPrice">Average Buy Price ({currency})</Label>
                <Input
                  id="buyPrice"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground mb-1">Estimated Value</div>
                <div className="text-xl font-semibold">
                  {formatPrice(
                    parseFloat(quantity || '0') * parseFloat(buyPrice || '0'),
                    currency
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting || !selectedAssetId || !quantity || !buyPrice}
                className="neo-brutal-button"
              >
                {isSubmitting ? 'Adding...' : 'Add to Portfolio'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(price);
}
