import { useEffect, useState } from "react";
import { useAppData } from "@/context/AppDataContext";
import { BLOOD_GROUPS, type BloodGroup } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Props { open: boolean; onClose: () => void; }

export default function RequestModal({ open, onClose }: Props) {
  const { hospitals, addRequest } = useAppData();
  const [hospital, setHospital] = useState(String(hospitals[0]?.hospital_id ?? ""));
  const [bg, setBg] = useState<BloodGroup>("O+");
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");
  useEffect(() => { if (open) { setHospital(String(hospitals[0]?.hospital_id ?? "")); setBg("O+"); setQty(1); setErr(""); } }, [open, hospitals]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (qty < 1) { setErr("Quantity must be > 0"); return; }
    const r = await addRequest({ hospital_id: Number(hospital), blood_group: bg, quantity: qty });
    import("sonner").then(({ toast }) => r.ok ? toast.success(r.message) : toast.error(r.message));
    if (r.ok) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>New Blood Request</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <Label>Hospital</Label>
            <Select value={hospital} onValueChange={setHospital}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {hospitals.map(h => <SelectItem key={h.hospital_id} value={String(h.hospital_id)}>{h.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Blood Group</Label>
              <Select value={bg} onValueChange={(v) => setBg(v as BloodGroup)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{BLOOD_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Quantity</Label>
              <Input type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value))} />
              {err && <p className="text-xs text-destructive">{err}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
