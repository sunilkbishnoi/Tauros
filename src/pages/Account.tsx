
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AccountMembership } from "@/components/account/AccountMembership";
import { AccountAccess } from "@/components/account/AccountAccess";
import { AccountSecurity } from "@/components/account/AccountSecurity";
import { Briefcase, Settings, UserCircle, Shield, LockKeyhole, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Account() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Determine active tab from URL if available
  const getTabFromURL = () => {
    const path = location.pathname;
    if (path.includes('/account/membership')) return "membership";
    if (path.includes('/account/access')) return "access";
    if (path.includes('/account/security')) return "security";
    return "profile";
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromURL());
  const [formData, setFormData] = useState({
    firstName: "Sunil",
    lastName: "Bishnoi",
    email: "sunil@example.com",
    timezone: "Asia/Kolkata (GMT+5:30)",
    marketNotifications: true,
    portfolioUpdates: true
  });
  
  // Update URL when tab changes
  useEffect(() => {
    if (activeTab === "profile") {
      navigate("/account", { replace: true });
    } else {
      navigate(`/account/${activeTab}`, { replace: true });
    }
  }, [activeTab, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      description: "Profile updated successfully",
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You have been successfully logged out.",
    });
    // For demo purposes just show a toast
  };
  
  const setTab = (tab: string) => {
    setActiveTab(tab);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center space-y-4 py-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" />
                    <AvatarFallback>SB</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-center">
                    <h3 className="text-xl font-medium">{formData.firstName} {formData.lastName}</h3>
                    <p className="text-sm text-muted-foreground">Premium Member</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Change Photo
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-2">
                <div className="space-y-1">
                  <Button 
                    variant={activeTab === "profile" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setTab("profile")}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button 
                    variant={activeTab === "membership" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setTab("membership")}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Membership
                  </Button>
                  <Button 
                    variant={activeTab === "access" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setTab("access")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Access Control
                  </Button>
                  <Button 
                    variant={activeTab === "security" ? "default" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setTab("security")}
                  >
                    <LockKeyhole className="mr-2 h-4 w-4" />
                    Security
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            <div className={activeTab === "profile" ? "block" : "hidden"}>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your account information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            value={formData.firstName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            value={formData.lastName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input 
                          id="timezone" 
                          value={formData.timezone}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="marketNotifications">Market Notifications</Label>
                          <Switch 
                            id="marketNotifications" 
                            checked={formData.marketNotifications}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ ...prev, marketNotifications: checked }))
                            }
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about important market events and price alerts
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="portfolioUpdates">Portfolio Updates</Label>
                          <Switch 
                            id="portfolioUpdates" 
                            checked={formData.portfolioUpdates}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ ...prev, portfolioUpdates: checked }))
                            }
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Receive daily and weekly summaries of your portfolio performance
                        </p>
                      </div>
                    </div>
                    
                    <Button type="submit">Save Changes</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className={activeTab === "membership" ? "block" : "hidden"}>
              <AccountMembership />
            </div>
            
            <div className={activeTab === "access" ? "block" : "hidden"}>
              <AccountAccess />
            </div>
            
            <div className={activeTab === "security" ? "block" : "hidden"}>
              <AccountSecurity />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
