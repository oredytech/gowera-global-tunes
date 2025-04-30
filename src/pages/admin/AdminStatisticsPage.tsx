
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, DonutChart } from "@tremor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart as BarChartIcon } from 'lucide-react';

// This is a simplified page with mock data
// In a real application, you would fetch this data from your analytics service
const visitData = [
  { date: "Jan 22", visits: 2890 },
  { date: "Feb 22", visits: 2756 },
  { date: "Mar 22", visits: 3322 },
  { date: "Apr 22", visits: 3470 },
  { date: "May 22", visits: 3475 },
  { date: "Jun 22", visits: 3129 }
];

const countryData = [
  { name: "France", value: 35 },
  { name: "RD Congo", value: 25 },
  { name: "États-Unis", value: 15 },
  { name: "Canada", value: 10 },
  { name: "Belgique", value: 5 },
  { name: "Autres", value: 10 }
];

const deviceData = [
  { device: "Mobile", sessions: 48 },
  { device: "Desktop", sessions: 35 },
  { device: "Tablet", sessions: 17 }
];

const AdminStatisticsPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BarChartIcon className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Statistiques</h1>
        </div>
        <Select defaultValue="30days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 derniers jours</SelectItem>
            <SelectItem value="30days">30 derniers jours</SelectItem>
            <SelectItem value="90days">90 derniers jours</SelectItem>
            <SelectItem value="12months">12 derniers mois</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Visites totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">124,892</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              +12.3% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nombre d'écoutes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45,820</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              +8.7% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs inscrits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,250</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              +5.2% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="visits" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="visits">Visites</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visits">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des visites</CardTitle>
              <CardDescription>
                Nombre de visites sur les 6 derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {/* Using a placeholder div instead of actual chart since @tremor/react is not installed */}
                <div className="w-full h-full bg-muted/30 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Graphique d'évolution des visites</p>
                  {/* In a real implementation, you would use: */}
                  {/* <LineChart 
                    data={visitData}
                    index="date"
                    categories={["visits"]}
                    colors={["blue"]}
                    valueFormatter={(value) => `${value.toLocaleString()} visites`}
                  /> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par pays</CardTitle>
                <CardDescription>
                  Distribution des visiteurs par pays d'origine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {/* Placeholder for chart */}
                  <div className="w-full h-full bg-muted/30 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Graphique de répartition par pays</p>
                    {/* <DonutChart 
                      data={countryData}
                      category="value"
                      index="name"
                      valueFormatter={(value) => `${value}%`}
                      colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
                    /> */}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Appareils utilisés</CardTitle>
                <CardDescription>
                  Types d'appareils utilisés pour accéder au site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {/* Placeholder for chart */}
                  <div className="w-full h-full bg-muted/30 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Graphique des appareils utilisés</p>
                    {/* <BarChart 
                      data={deviceData}
                      index="device"
                      categories={["sessions"]}
                      colors={["blue"]}
                      valueFormatter={(value) => `${value}%`}
                    /> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Taux d'engagement</CardTitle>
              <CardDescription>
                Mesure de l'interaction des utilisateurs avec le contenu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-1">Durée moyenne de session</p>
                  <p className="text-2xl font-bold">4m 32s</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-1">Pages par session</p>
                  <p className="text-2xl font-bold">3.2</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-1">Taux de rebond</p>
                  <p className="text-2xl font-bold">42.3%</p>
                </div>
              </div>
              
              <div className="mt-6 h-64">
                {/* Placeholder for chart */}
                <div className="w-full h-full bg-muted/30 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Graphique d'engagement au fil du temps</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStatisticsPage;
