import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAppData } from "@/context/AppDataContext";
import type { Donor, BloodGroup } from "@/types";
import { BLOOD_GROUPS } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Pencil, Trash2, Plus, Search, Users } from "lucide-react";
import DonorModal from "@/components/donors/DonorModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { fmtDate, groupBadgeClasses } from "@/utils/helpers";
import { TableSkeleton, EmptyState, useFakeLoad } from "@/components/ui/states";

const PAGE = 10;

export default function Donors() {
  const { donors, addDonor, updateDonor, deleteDonor } = useAppData();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Donor | null>(null);
  const [confirmDel, setConfirmDel] = useState<Donor | null>(null);
  const loading = useFakeLoad([donors.length]);

  const filtered = useMemo(() => {
    return donors.filter(d => {
      const matchQ = !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.blood_group.toLowerCase() === q.toLowerCase();
      const matchG = filter === "all" || d.blood_group === filter;
      return matchQ && matchG;
    });
  }, [donors, q, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const pageRows = filtered.slice((page - 1) * PAGE, page * PAGE);

  const handleSave = async (data: Omit<Donor, "donor_id"> | Donor) => {
    if ("donor_id" in data) {
      const r = await updateDonor(data);
      r.ok ? toast.success(r.message) : toast.error(r.message);
    } else {
      const r = await addDonor(data);
      r.ok ? toast.success(r.message) : toast.error(r.message);
      if (!r.ok) return;
    }
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by name or blood group" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
          </div>
          <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blood Groups</SelectItem>
              {BLOOD_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus className="w-4 h-4" /> Add Donor
          </Button>
        </CardContent>
      </Card>

      <Card>
        {loading ? <TableSkeleton cols={10} /> : pageRows.length === 0 ? (
          <EmptyState icon={<Users />} title="No donors found" hint="Try adjusting your filters or add one." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Age</TableHead>
                <TableHead>Gender</TableHead><TableHead>Group</TableHead><TableHead>Phone</TableHead>
                <TableHead>Email</TableHead><TableHead>Address</TableHead><TableHead>Last Donation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map(d => (
                <TableRow key={d.donor_id}>
                  <TableCell>#{d.donor_id}</TableCell>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.age}</TableCell>
                  <TableCell>{d.gender}</TableCell>
                  <TableCell><Badge className={groupBadgeClasses(d.blood_group)}>{d.blood_group}</Badge></TableCell>
                  <TableCell>{d.phone}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{d.email}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{d.address}</TableCell>
                  <TableCell>{fmtDate(d.last_donation_date)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(d); setModalOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmDel(d)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {filtered.length > PAGE && (
          <div className="flex items-center justify-between p-3 border-t border-border/40 text-sm">
            <span className="text-muted-foreground">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>

      <DonorModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} initial={editing} onSave={handleSave} />

      <Dialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete donor?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will remove <span className="text-foreground font-medium">{confirmDel?.name}</span> permanently.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDel(null)}>Cancel</Button>
            <Button variant="destructive" onClick={async () => { if (confirmDel) { const r = await deleteDonor(confirmDel.donor_id); r.ok ? toast.success("Donor deleted") : toast.error(r.message); setConfirmDel(null); } }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
