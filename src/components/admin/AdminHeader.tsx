
import React from 'react';
import { UserProfileButton } from '../auth/UserProfileButton';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminHeader = () => {
  const { currentUser } = useAuth();
  
  return (
    <header className="border-b bg-background p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          Tableau de bord d'administration
        </h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <UserProfileButton />
        </div>
      </div>
    </header>
  );
};
