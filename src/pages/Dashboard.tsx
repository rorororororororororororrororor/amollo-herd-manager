import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { milkApi } from '@/services/api';
import { getCurrentUser } from '@/config/api';
import type { DashboardStats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Milk, TrendingUp, Droplets, Award } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = getCurrentUser();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // For now, using a default farm ID - you'll need to implement farm selection
      const data = await milkApi.getDashboardStats('default-farm-id');
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/30 rounded-lg p-6 border">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Herd Size</CardTitle>
            <Milk className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.herd_size || 0}</div>
            <p className="text-xs text-muted-foreground">Total animals</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Production</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.daily_production.toFixed(1) || '0.0'} L</div>
            <p className="text-xs text-muted-foreground">Current date</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.daily_sold.toFixed(1) || '0.0'} L</div>
            <p className="text-xs text-muted-foreground">Revenue generating</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lactating Cows</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.lactating_cows || 0}</div>
            <p className="text-xs text-muted-foreground">Active producers</p>
          </CardContent>
        </Card>
      </div>

      {/* Production Chart and Stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>7-Day Milk Production</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.weekly_production || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'Litres', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="production" fill="hsl(var(--primary))" name="Production" />
                <Bar dataKey="sold" fill="hsl(var(--accent-foreground))" name="Sold" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Avg Daily Yield</p>
              <p className="text-2xl font-bold">{stats?.avg_daily_yield.toFixed(1) || '0.0'} L</p>
            </div>
            
            {stats?.highest_producer && (
              <div className="space-y-2 border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground">Highest Producer</p>
                <p className="font-semibold">{stats.highest_producer.name}</p>
                <p className="text-sm text-muted-foreground">
                  {stats.highest_producer.tag_id} • {stats.highest_producer.yield.toFixed(1)} L today
                </p>
              </div>
            )}
            
            {stats?.lowest_producer && (
              <div className="space-y-2 border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground">Lowest Producer</p>
                <p className="font-semibold">{stats.lowest_producer.name}</p>
                <p className="text-sm text-muted-foreground">
                  {stats.lowest_producer.tag_id} • {stats.lowest_producer.yield.toFixed(1)} L today
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
