import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/services/api';
import { setAuthToken, setCurrentUser } from '@/config/api';
import type { UserRole } from '@/types';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [rootCredentials, setRootCredentials] = useState({
    phone_number: '0724535739',
    password: 'Newpassword1',
  });

  const [farmhandPhone, setFarmhandPhone] = useState('');

  const handleLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const credentials = role === 'root'
        ? { ...rootCredentials, role }
        : { phone_number: farmhandPhone, role };

      const response = await authApi.login(credentials);
      
      setAuthToken(response.token);
      setCurrentUser(response.user);
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${response.user.name}!`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23059669" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />
      </div>

      <Card className="w-full max-w-md mx-4 shadow-2xl border-2 backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Amollo Dairy Farm
          </CardTitle>
          <CardDescription className="text-base">
            Herd Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="root" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="root">Root User</TabsTrigger>
              <TabsTrigger value="farmhand">Farm Hand</TabsTrigger>
            </TabsList>
            
            <TabsContent value="root" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="root-phone">Phone Number</Label>
                <Input
                  id="root-phone"
                  type="tel"
                  placeholder="0724535739"
                  value={rootCredentials.phone_number}
                  onChange={(e) => setRootCredentials({ ...rootCredentials, phone_number: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="root-password">Password</Label>
                <Input
                  id="root-password"
                  type="password"
                  placeholder="Enter your password"
                  value={rootCredentials.password}
                  onChange={(e) => setRootCredentials({ ...rootCredentials, password: e.target.value })}
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin('root')}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleLogin('root')}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In as Root User'}
              </Button>
            </TabsContent>
            
            <TabsContent value="farmhand" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="farmhand-phone">Phone Number</Label>
                <Input
                  id="farmhand-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={farmhandPhone}
                  onChange={(e) => setFarmhandPhone(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin('farmhand')}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleLogin('farmhand')}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In as Farm Hand'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
