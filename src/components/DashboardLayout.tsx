import { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCurrentUser, removeAuthToken, removeCurrentUser } from '@/config/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Home, 
  Settings, 
  Milk, 
  FileText, 
  Heart, 
  Activity, 
  DollarSign, 
  BarChart3,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const user = getCurrentUser();

  const handleLogout = () => {
    removeAuthToken();
    removeCurrentUser();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const canAccessExpenses = user?.role === 'root' || user?.can_access_expenses;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center px-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Milk className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">Amollo Dairy</span>
          </div>

          <nav className="flex gap-1 flex-1 overflow-x-auto">
            <Link to="/dashboard">
              <Button variant={isActive('/dashboard') ? 'default' : 'ghost'} size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>

            {user?.role === 'root' && (
              <Link to="/farm-settings">
                <Button variant={isActive('/farm-settings') ? 'default' : 'ghost'} size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Farm Settings
                </Button>
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={isActive('/animals') || isActive('/milk-records') ? 'default' : 'ghost'} size="sm">
                  <Milk className="h-4 w-4 mr-2" />
                  Animals
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate('/animals')}>
                  View Animals
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/milk-records')}>
                  Milk Records
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={isActive('/disease-records') || isActive('/preventive-health') ? 'default' : 'ghost'} size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Health
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate('/disease-records')}>
                  Disease Records
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/preventive-health')}>
                  Preventive Procedures
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/breeding">
              <Button variant={isActive('/breeding') ? 'default' : 'ghost'} size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Breeding
              </Button>
            </Link>

            <Link to="/expenses">
              <Button 
                variant={isActive('/expenses') ? 'default' : 'ghost'} 
                size="sm"
                disabled={!canAccessExpenses}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Expenses
              </Button>
            </Link>

            <Link to="/reports">
              <Button variant={isActive('/reports') ? 'default' : 'ghost'} size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </Link>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.name}'s Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
