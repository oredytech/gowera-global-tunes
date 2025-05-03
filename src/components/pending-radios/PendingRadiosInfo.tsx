
interface PendingRadiosInfoProps {
  className?: string;
}

export const PendingRadiosInfo = ({ className = "" }: PendingRadiosInfoProps) => {
  return (
    <div className={`bg-card rounded-lg border p-6 mb-6 ${className}`}>
      <p className="text-muted-foreground">
        Ces radios ont été suggérées par les utilisateurs et sont en attente de validation par l'administrateur.
        Une fois validées, elles apparaîtront dans la liste principale des radios sur GOWERA.
      </p>
    </div>
  );
};
