import { useAppData } from "@/context/AppDataContext";
import { BLOOD_GROUPS } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { exportCSV, fmtDate, groupBadgeClasses } from "@/utils/helpers";

export default function Reports() {
  const { donors, units, donations, banks } = useAppData();

  const stockByGroup = BLOOD_GROUPS.map(g => ({
    group: g, count: units.filter(u => u.blood_group === g && u.status === "Available").length,
  }));
  const maxStock = Math.max(1, ...stockByGroup.map(s => s.count));

  const expired = units.filter(u => u.status === "Expired");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Donor Report</CardTitle>
          <Button size="sm" variant="outline"
            onClick={() => exportCSV("donor_report.csv", donors.map(d => ({ name: d.name, blood_group: d.blood_group, phone: d.phone })))}>
            <Download className="w-4 h-4" /> Download CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Blood Group</TableHead><TableHead>Phone</TableHead></TableRow></TableHeader>
            <TableBody>
              {donors.map(d => (
                <TableRow key={d.donor_id}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell><Badge className={groupBadgeClasses(d.blood_group)}>{d.blood_group}</Badge></TableCell>
                  <TableCell>{d.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Blood Stock by Group</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {stockByGroup.map(s => (
            <div key={s.group} className="flex items-center gap-4">
              <Badge className={`w-12 justify-center ${groupBadgeClasses(s.group)}`}>{s.group}</Badge>
              <div className="flex-1"><Progress value={(s.count / maxStock) * 100} /></div>
              <span className="font-display text-2xl w-12 text-right">{s.count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Donation History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Donor</TableHead><TableHead>Date</TableHead><TableHead>Unit</TableHead></TableRow></TableHeader>
            <TableBody>
              {donations.map(d => {
                const donor = donors.find(x => x.donor_id === d.donor_id);
                return (
                  <TableRow key={d.donation_id}>
                    <TableCell>{donor?.name ?? "—"}</TableCell>
                    <TableCell>{fmtDate(d.donation_date)}</TableCell>
                    <TableCell>#{d.unit_id}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Expired Units</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Unit ID</TableHead><TableHead>Group</TableHead><TableHead>Expiry</TableHead><TableHead>Bank</TableHead></TableRow></TableHeader>
            <TableBody>
              {expired.map(u => (
                <TableRow key={u.unit_id} className="bg-red-500/5">
                  <TableCell>#{u.unit_id}</TableCell>
                  <TableCell><Badge className={groupBadgeClasses(u.blood_group)}>{u.blood_group}</Badge></TableCell>
                  <TableCell>{fmtDate(u.expiry_date)}</TableCell>
                  <TableCell>{banks.find(b => b.bank_id === u.bank_id)?.name ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
