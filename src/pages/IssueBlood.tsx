import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fmtDate, groupBadgeClasses } from "@/utils/helpers";
import { EmptyState } from "@/components/ui/states";
import { HeartPulse } from "lucide-react";

export default function IssueBlood() {
  const { user } = useAuth();
  const { units, hospitals, issues, issueBlood } = useAppData();
  const available = units.filter(u => u.status === "Available");
  const [unit, setUnit] = useState<string>("");
  const [hospital, setHospital] = useState<string>("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!unit || !hospital) return toast.error("Please select both");
    const r = await issueBlood(Number(unit), Number(hospital));
    r.ok ? toast.success(r.message) : toast.error(r.message);
    if (r.ok) { setUnit(""); setHospital(""); }
  };

  const recent = [...issues].sort((a, b) => b.issue_id - a.issue_id).slice(0, 10);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Issue Blood Unit</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <Label>Available Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger><SelectValue placeholder="Choose unit" /></SelectTrigger>
                <SelectContent>
                  {available.length === 0 && <SelectItem value="none" disabled>No available units</SelectItem>}
                  {available.map(u => (
                    <SelectItem key={u.unit_id} value={String(u.unit_id)}>
                      Unit #{u.unit_id} — {u.blood_group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Hospital</Label>
              <Select value={hospital} onValueChange={setHospital}>
                <SelectTrigger><SelectValue placeholder="Choose hospital" /></SelectTrigger>
                <SelectContent>
                  {hospitals.map(h => <SelectItem key={h.hospital_id} value={String(h.hospital_id)}>{h.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Admin</Label>
              <Input value={user ? `${user.username} (#${user.admin_id})` : ""} disabled />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <Button type="submit" size="lg"><HeartPulse className="w-4 h-4" /> Issue Blood</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Issues</CardTitle></CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <EmptyState icon={<HeartPulse />} title="No issues yet" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue ID</TableHead><TableHead>Unit</TableHead><TableHead>Group</TableHead>
                  <TableHead>Hospital</TableHead><TableHead>Issue Date</TableHead><TableHead>Handled By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map(i => {
                  const u = units.find(x => x.unit_id === i.unit_id);
                  const h = hospitals.find(x => x.hospital_id === i.hospital_id);
                  return (
                    <TableRow key={i.issue_id}>
                      <TableCell>#{i.issue_id}</TableCell>
                      <TableCell>#{i.unit_id}</TableCell>
                      <TableCell>{u && <Badge className={groupBadgeClasses(u.blood_group)}>{u.blood_group}</Badge>}</TableCell>
                      <TableCell>{h?.name ?? "—"}</TableCell>
                      <TableCell>{fmtDate(i.issue_date)}</TableCell>
                      <TableCell>Admin #{i.handled_by}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
