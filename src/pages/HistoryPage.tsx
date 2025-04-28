import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
const HistoryPage = () => {
  const historyEntries = [{
    date: "28 Avril 2025",
    event: "Lancement de GOWERA v2.0",
    description: "Nouvelle interface et fonctionnalités améliorées"
  }, {
    date: "1 Janvier 2025",
    event: "Lancement officiel",
    description: "Première version publique de GOWERA"
  }];
  return <div className="container max-w-4xl mx-auto px-0">
      <h1 className="font-bold mb-8 text-2xl">Notre Histoire</h1>
      <div className="space-y-6">
        <p className="text-lg text-muted-foreground mb-8">
          Découvrez l&apos;évolution de GOWERA, de ses débuts à aujourd&apos;hui.
        </p>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Événement</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyEntries.map((entry, index) => <TableRow key={index}>
                <TableCell className="font-medium">{entry.date}</TableCell>
                <TableCell>{entry.event}</TableCell>
                <TableCell>{entry.description}</TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
    </div>;
};
export default HistoryPage;