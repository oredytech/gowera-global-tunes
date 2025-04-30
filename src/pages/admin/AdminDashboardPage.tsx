
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio, Users, BarChart, Megaphone } from 'lucide-react';
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from '../../services/firebase/config';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    pendingRadios: 0,
    approvedRadios: 0,
    totalUsers: 0,
    totalListens: 0,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get pending radios count
        const pendingRadiosQuery = query(
          collection(db, "radioSuggestions"),
          where("sponsored", "==", false)
        );
        const pendingSnapshot = await getDocs(pendingRadiosQuery);
        
        // Get approved radios count
        const approvedRadiosQuery = query(
          collection(db, "radioSuggestions"),
          where("sponsored", "==", true)
        );
        const approvedSnapshot = await getDocs(approvedRadiosQuery);
        
        // For demo purposes, we're using placeholder values for users and listens
        // In a real application, you would fetch these from your database
        
        setStats({
          pendingRadios: pendingSnapshot.size,
          approvedRadios: approvedSnapshot.size,
          totalUsers: 1250, // Placeholder
          totalListens: 45820, // Placeholder
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Radios en attente
            </CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.pendingRadios}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Radios à valider
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Radios approuvées
            </CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.approvedRadios}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de radios sur la plateforme
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Utilisateurs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Utilisateurs inscrits
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Écoutes
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalListens}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total des écoutes
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Radios récemment suggérées</CardTitle>
            <CardDescription>
              Les 5 dernières radios proposées par les utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Chargement...</p>
            ) : (
              <div className="space-y-4">
                {/* 
                  In a real application, you would fetch and display the recent radio suggestions here.
                  For now, we'll show a placeholder message.
                */}
                <p className="text-muted-foreground text-sm">
                  {stats.pendingRadios > 0 
                    ? `Vous avez ${stats.pendingRadios} radio(s) en attente de validation.` 
                    : "Aucune radio en attente de validation."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performances publicitaires</CardTitle>
            <CardDescription>
              Aperçu des performances des campagnes publicitaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Impressions</p>
                  <p className="text-2xl font-bold">12.4K</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Clics</p>
                  <p className="text-2xl font-bold">348</p>
                </div>
                <div>
                  <p className="text-sm font-medium">CTR</p>
                  <p className="text-2xl font-bold">2.8%</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Revenus (mois en cours)</p>
                <p className="text-2xl font-bold">$1,245.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
