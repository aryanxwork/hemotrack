import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAppData } from "@/context/AppDataContext";
import type { Hospital } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Building2, Search, Eye } from "lucide-react";
import HospitalModal from "@/components/hospitals/HospitalModal";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TableSkeleton, EmptyState, useFakeLoad } from "@/components/ui/states";
import { fmtDate, groupBadgeClasses, statusBadgeClasses } from "@/utils/helpers";

export default function Hospitals() {
  const { hospitals, addHospital, updateHospital, deleteHospital, requests } = useAppData();
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Hospital | null>(null);
  const [confirmDel, setConfirmDel] = useState<Hospital | null>(null);
  const [drawer, setDrawer] = useState<Hospital | null>(null);
  const loading = useFakeLoad([hospitals.length]);

  const filtered = useMemo(() =>
    hospitals.filter(h => !q || h.name.toLowerCase().includes(q.toLowerCase())),
    [hospitals, q]);

  const drawerReqs = drawer ? requests.filter(r => r.hospital_id === drawer.hospital_id) : [];

  const handleSave = async (data: Omit<Hospital, "hospital_id"> | Hospital) => {
    if ("hospital_id" in data) { 
      const r = await updateHospital(data); 
      r.ok ? toast.success(r.message) : toast.error(r.message);
    }
    else { 
      const r = await addHospital(data); 
      r.ok ? toast.success(r.message) : toast.error(r.message);
    }
    setModal(false);
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search hospitals" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <Button onClick={() => { setEditing(null); setModal(true); }}><Plus className="w-4 h-4" /> Add Hospital</Button>
        </CardContent>
      </Card>

      <Card>
        {loading ? <TableSkeleton cols={6} /> : filtered.length === 0 ? (
          <EmptyState icon={<Building2 />} title="No hospitals yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Address</TableHead>
                <TableHead>Contact</TableHead><TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(h => (
                <TableRow key={h.hospital_id}>
                  <TableCell>#{h.hospital_id}</TableCell>
                  <TableCell className="font-medium">{h.name}</TableCell>
                  <TableCell className="max-w-[260px] truncate">{h.address}</TableCell>
                  <TableCell>{h.contact_no}</TableCell>
                  <TableCell>{h.email}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button size="sm" variant="outline" onClick={() => setDrawer(h)}><Eye className="w-4 h-4" /> Requests</Button>
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(h); setModal(true); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmDel(h)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <HospitalModal open={modal} onClose={() => { setModal(false); setEditing(null); }} initial={editing} onSave={handleSave} />

      <Dialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete hospital?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Remove <span className="text-foreground font-medium">{confirmDel?.name}</span>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDel(null)}>Cancel</Button>
            <Button variant="destructive" onClick={async () => { if (confirmDel) { const r = await deleteHospital(confirmDel.hospital_id); r.ok ? toast.success("Hospital deleted") : toast.error(r.message); setConfirmDel(null); } }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer open={!!drawer} onOpenChange={(o) => !o && setDrawer(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{drawer?.name}</DrawerTitle>
            <DrawerDescription>Blood requests for this hospital</DrawerDescription>
          </DrawerHeader>
          {drawerReqs.length === 0 ? (
            <EmptyState icon={<Building2 />} title="No requests" />
          ) : (
            <div className="space-y-2">
              {drawerReqs.map(r => (
                <div key={r.request_id} className="flex items-center justify-between p-3 rounded-md border border-border/50">
                  <div>
                    <p className="text-sm font-medium">Request #{r.request_id}</p>
                    <p className="text-xs text-muted-foreground">{fmtDate(r.request_date)} • Qty {r.quantity}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={groupBadgeClasses(r.blood_group)}>{r.blood_group}</Badge>
                    <Badge className={statusBadgeClasses(r.status)}>{r.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
