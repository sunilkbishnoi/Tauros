import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Smartphone, Shield, Check, Tablet, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export function AccountSecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const { toast } = useToast();
  
  const handleToggleTwoFactor = () => {
    if (!twoFactorEnabled) {
      setShowQRCode(true);
    } else {
      setTwoFactorEnabled(false);
      setShowQRCode(false);
      toast({
        description: "Two-factor authentication disabled",
      });
    }
  };
  
  const handleEnableTwoFactor = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }
    
    setTwoFactorEnabled(true);
    setShowQRCode(false);
    setVerificationCode("");
    toast({
      description: "Two-factor authentication enabled",
    });
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      description: "Password updated successfully",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account security and authentication methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch 
                checked={twoFactorEnabled} 
                onCheckedChange={handleToggleTwoFactor}
              />
            </div>
            
            {showQRCode && (
              <div className="p-4 border rounded-md bg-muted/50">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Scan QR Code</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Scan this QR code with your authenticator app
                    </p>
                    <div className="bg-white p-4 rounded-md w-32 h-32 mx-auto sm:mx-0">
                      <img 
                        src="data:image/png;base64,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" 
                        alt="QR Code for 2FA"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Verify Code</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter the 6-digit code from your authenticator app
                    </p>
                    <form onSubmit={handleEnableTwoFactor} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="verificationCode">Verification Code</Label>
                        <Input 
                          id="verificationCode" 
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="000000"
                          maxLength={6}
                          className="font-mono text-center text-lg"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          type="button"
                          onClick={() => setShowQRCode(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Verify and Enable</Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
            
            {twoFactorEnabled && (
              <div className="flex items-center p-3 bg-green-500/10 text-green-500 rounded-md">
                <Check className="h-5 w-5 mr-2" />
                <span>Two-factor authentication is enabled for your account</span>
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button type="submit">Update Password</Button>
            </form>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-2">Login Devices</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Devices that are currently logged in to your account
            </p>
            
            <div className="space-y-2">
              <div className="p-3 border rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="font-medium">iPhone 15 Pro</p>
                    <p className="text-xs text-muted-foreground">Mumbai, India • Last active: Just now</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">Current</Badge>
              </div>
              
              <div className="p-3 border rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <Monitor className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="font-medium">MacBook Pro</p>
                    <p className="text-xs text-muted-foreground">Delhi, India • Last active: 2 hours ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Sign Out</Button>
              </div>
              
              <div className="p-3 border rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <Tablet className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="font-medium">iPad Air</p>
                    <p className="text-xs text-muted-foreground">Jaipur, India • Last active: 5 days ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Sign Out</Button>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="p-4 border border-red-200 rounded-md bg-red-50 dark:bg-red-950/20 dark:border-red-900/50">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-500">Danger Zone</h4>
                  <p className="text-sm text-red-500/90 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
