
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PendingRadioCard } from "./PendingRadioCard";
import { PendingRadiosEmptyState } from "./PendingRadiosEmptyState";

interface PendingRadio {
  id: string;
  radioName: string;
  description: string;
  streamUrl: string;
  websiteUrl?: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: any; // Firestore timestamp
}

interface PendingRadiosListProps {
  pendingRadios: PendingRadio[];
  loading: boolean;
  approving: boolean;
  onApproveRadio: (radio: PendingRadio) => void;
}

export const PendingRadiosList = ({ 
  pendingRadios, 
  loading, 
  approving, 
  onApproveRadio 
}: PendingRadiosListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (pendingRadios.length === 0) {
    return <PendingRadiosEmptyState />;
  }

  return (
    <div className="space-y-4">
      {pendingRadios.map((radio) => (
        <PendingRadioCard 
          key={radio.id} 
          radio={radio} 
          onApprove={onApproveRadio}
          approving={approving}
        />
      ))}
    </div>
  );
};
