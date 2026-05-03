import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAppData } from "@/context/AppDataContext";
import { BLOOD_GROUPS } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Droplets } from "lucide-react";
import BloodUnitModal from "@/components/blood-units/BloodUnitModal";
import StatCard from "@/components/dashboard/StatCard";
import { fmtDate, groupBadgeClasses, statusBadgeClasses } from "@/utils/helpers";
import { TableSkeleton, EmptyState, useFakeLoad } from "@/components/ui/states";

export default function BloodUnits() {
  const { units, banks } = useAppData();
  const [statusFilter, setStatusFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const loading = useFakeLoad([units.length]);

  const filtered = useMemo(() => units.filter(u =>
    (statusFilter === "all" || u.status === statusFilter) &&
    (groupFilter === "all" || u.blood_group === groupFilter)
  ), [units, statusFilter, groupFilter]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Available" value={units.filter(u => u.status === "Available").length} Icon={Droplets} accent="emerald" />
        <StatCard label="Issued" value={units.filter(u => u.status === "Issued").length} Icon={Droplets} accent="blue" />
        <StatCard label="Expired" value={units.filter(u => u.status === "Expired").length} Icon={Droplets} accent="primary" />
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {["Available","Issued","Expired"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blood Groups</SelectItem>
              {BLOOD_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex-1" />
          <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> Add Unit</Button>
        </CardContent>
      </Card>

      <Card>
        {loading ? <TableSkeleton cols={7} /> : filtered.length === 0 ? (
          <EmptyState icon={<Droplets />} title="No units found" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit ID</TableHead><TableHead>Group</TableHead>
                <TableHead>Collection</TableHead><TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead><TableHead>Bank</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(u => {
                const bank = banks.find(b => b.bank_id === u.bank_id);
                return (
                  <TableRow key={u.unit_id} className={u.status === "Expired" ? "bg-red-500/5" : ""}>
                    <TableCell>#{u.unit_id}</TableCell>
                    <TableCell><Badge className={groupBadgeClasses(u.blood_group)}>{u.blood_group}</Badge></TableCell>
                    <TableCell>{fmtDate(u.collection_date)}</TableCell>
                    <TableCell>{fmtDate(u.expiry_date)}</TableCell>
                    <TableCell><Badge className={statusBadgeClasses(u.status)}>{u.status}</Badge></TableCell>
                    <TableCell>{bank?.name ?? "—"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <BloodUnitModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
