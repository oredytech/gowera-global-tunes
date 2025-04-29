import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
const NewsPage = () => {
  const newsItems = [{
    id: 1,
    title: "Lancement de 50 nouvelles stations",
    date: "20 Avril 2025",
    description: "GOWERA s'agrandit avec l'ajout de 50 nouvelles stations de radio du monde entier."
  }, {
    id: 2,
    title: "Nouvelle fonctionnalité de partage",
    date: "15 Avril 2025",
    description: "Partagez facilement vos stations préférées avec vos amis sur les réseaux sociaux."
  }, {
    id: 3,
    title: "Mise à jour de l'interface utilisateur",
    date: "10 Avril 2025",
    description: "GOWERA fait peau neuve avec une interface plus intuitive et plus rapide."
  }];
  return <div className="container py-0 px-0">
      <SectionHeader title="Actualités" description="Les dernières nouvelles et mises à jour de GOWERA" icon={<Newspaper className="h-6 w-6" />} />

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsItems.map(news => <Card key={news.id}>
            <CardHeader>
              <CardTitle>{news.title}</CardTitle>
              <CardDescription>{news.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{news.description}</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">GOWERA</p>
            </CardFooter>
          </Card>)}
      </div>
    </div>;
};
export default NewsPage;