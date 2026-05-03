import { useEffect, useState } from "react";
import { useAppData } from "@/context/AppDataContext";
import { BLOOD_GROUPS, type BloodGroup, type BloodUnit } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Props { open: boolean; onClose: () => void; }

export default function BloodUnitModal({ open, onClose }: Props) {
  const { addUnit, banks } = useAppData();
  const [bg, setBg] = useState<BloodGroup>("O+");
  const [coll, setColl] = useState("");
  const [exp, setExp] = useState("");
  const [bank, setBank] = useState<string>(String(banks[0]?.bank_id ?? 1));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (open) { setBg("O+"); setColl(""); setExp(""); setBank(String(banks[0]?.bank_id ?? 1)); setErrors({}); } }, [open, banks]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!coll) er.coll = "Required";
    if (!exp) er.exp = "Required";
    if (coll && exp && exp < coll) er.exp = "Expiry must be after collection";
    setErrors(er);
    if (Object.keys(er).length) return;
    const r = await addUnit({ blood_group: bg, collection_date: coll, expiry_date: exp, bank_id: Number(bank) });
    import("sonner").then(({ toast }) => r.ok ? toast.success(r.message) : toast.error(r.message));
    if (r.ok) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Blood Unit</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <Label>Blood Group</Label>
            <Select value={bg} onValueChange={(v) => setBg(v as BloodGroup)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{BLOOD_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Collection Date</Label>
              <Input type="date" value={coll} onChange={e => setColl(e.target.value)} />
              {errors.coll && <p className="text-xs text-destructive">{errors.coll}</p>}
            </div>
            <div className="space-y-1">
              <Label>Expiry Date</Label>
              <Input type="date" value={exp} onChange={e => setExp(e.target.value)} />
              {errors.exp && <p className="text-xs text-destructive">{errors.exp}</p>}
            </div>
          </div>
          <div className="space-y-1">
            <Label>Blood Bank</Label>
            <Select value={bank} onValueChange={setBank}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{banks.map(b => <SelectItem key={b.bank_id} value={String(b.bank_id)}>{b.name} — {b.location}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Unit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
