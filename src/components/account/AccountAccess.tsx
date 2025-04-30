
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Key, Trash2, Plus, RefreshCw, Copy, Check, UserPlus, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function AccountAccess() {
  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Trading Bot", lastUsed: "2 hours ago", active: true, created: "May 10, 2024" },
    { id: "2", name: "Mobile App", lastUsed: "1 day ago", active: true, created: "April 15, 2024" }
  ]);
  
  const [sharedUsers, setSharedUsers] = useState([
    { id: "1", email: "priyanshu@example.com", name: "Priyanshu Bhati", role: "viewer", lastAccess: "Yesterday" },
    { id: "2", email: "kalp@example.com", name: "Kalp Veer", role: "editor", lastAccess: "3 days ago" }
  ]);
  
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  
  const { toast } = useToast();
  
  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    
    const newKey = {
      id: Date.now().toString(),
      name: newKeyName,
      lastUsed: "Just now",
      active: true,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    
    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setShowNewKeyForm(false);
    
    toast({
      description: "API key created successfully",
    });
  };
  
  const handleRevokeApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast({
      description: "API key revoked successfully",
    });
  };
  
  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    toast({
      description: `Invitation sent to ${inviteEmail}`,
    });
    
    setInviteEmail("");
    setShowInviteForm(false);
  };
  
  const handleRemoveUser = (id: string) => {
    setSharedUsers(sharedUsers.filter(user => user.id !== id));
    toast({
      description: "User access removed successfully",
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="api-keys">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="shared-access">Shared Access</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage API keys for external integrations
                  </CardDescription>
                </div>
                <Button onClick={() => setShowNewKeyForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New API Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showNewKeyForm && (
                <div className="mb-6 p-4 border rounded-md bg-muted/50">
                  <h3 className="text-lg font-medium mb-4">Create New API Key</h3>
                  <form onSubmit={handleCreateApiKey} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyName">Key Name</Label>
                      <Input 
                        id="keyName" 
                        placeholder="e.g., Trading Bot, Mobile App" 
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Give this API key a name to remember what it's used for
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        type="button"
                        onClick={() => setShowNewKeyForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Create Key</Button>
                    </div>
                  </form>
                </div>
              )}
              
              {apiKeys.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">{key.name}</TableCell>
                          <TableCell>{key.created}</TableCell>
                          <TableCell>{key.lastUsed}</TableCell>
                          <TableCell>
                            {key.active ? 
                              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">Active</Badge> : 
                              <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-200">Inactive</Badge>
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  toast({
                                    description: "API key copied to clipboard",
                                  });
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  toast({
                                    description: "API key regenerated",
                                  });
                                }}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleRevokeApiKey(key.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Key className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No API Keys</h3>
                  <p className="text-muted-foreground max-w-sm mb-4">
                    You haven't created any API keys yet. Create an API key to integrate with external services.
                  </p>
                  <Button onClick={() => setShowNewKeyForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </Button>
                </div>
              )}
              
              {/* Sample API key display */}
              {apiKeys.length > 0 && (
                <div className="mt-6 p-4 border rounded-md bg-muted/50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Your API Key</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showApiKey ? "Hide" : "Show"}
                    </Button>
                  </div>
                  
                  <div className="flex mt-2">
                    <Input 
                      value={showApiKey ? "sk_live_51NzuRTXpWSHKCFGaT3TgXdKvAdZ5PX" : "••••••••••••••••••••••••••••••••••"}
                      readOnly
                      className="font-mono"
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => {
                        toast({
                          description: "API key copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  
                  <p className="text-sm text-red-500 mt-2">
                    Never share your API keys publicly. They provide full access to your account.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shared-access" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Shared Access</CardTitle>
                  <CardDescription>
                    Manage who can access your portfolio data
                  </CardDescription>
                </div>
                <Button onClick={() => setShowInviteForm(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showInviteForm && (
                <div className="mb-6 p-4 border rounded-md bg-muted/50">
                  <h3 className="text-lg font-medium mb-4">Invite User</h3>
                  <form onSubmit={handleInviteUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="colleague@example.com" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="accessLevel">Access Level</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-md p-3 flex items-start space-x-3 cursor-pointer hover:border-primary">
                          <div className="mt-1">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Viewer</p>
                            <p className="text-sm text-muted-foreground">
                              Can view your portfolios but cannot make changes
                            </p>
                          </div>
                        </div>
                        <div className="border rounded-md p-3 flex items-start space-x-3 cursor-pointer">
                          <div className="mt-1 h-4 w-4"></div>
                          <div>
                            <p className="font-medium">Editor</p>
                            <p className="text-sm text-muted-foreground">
                              Can view and make changes to your portfolios
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        type="button"
                        onClick={() => setShowInviteForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Send Invite</Button>
                    </div>
                  </form>
                </div>
              )}
              
              {sharedUsers.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Access Level</TableHead>
                        <TableHead>Last Access</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sharedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={user.role === "editor" ? 
                              "bg-blue-500/10 text-blue-500 border-blue-200" : 
                              "bg-green-500/10 text-green-500 border-green-200"
                            }>
                              {user.role === "editor" ? "Editor" : "Viewer"}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.lastAccess}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleRemoveUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <UserPlus className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Shared Access</h3>
                  <p className="text-muted-foreground max-w-sm mb-4">
                    You haven't shared your portfolio with anyone yet. Invite users to view or edit your portfolio.
                  </p>
                  <Button onClick={() => setShowInviteForm(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite User
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
