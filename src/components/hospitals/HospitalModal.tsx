import { useEffect, useState } from "react";
import type { Hospital } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Props {
  open: boolean; onClose: () => void;
  initial?: Hospital | null;
  onSave: (h: Omit<Hospital, "hospital_id"> | Hospital) => void;
}
const empty: Omit<Hospital, "hospital_id"> = { name: "", address: "", contact_no: "", email: "" };

export default function HospitalModal({ open, onClose, initial, onSave }: Props) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => { if (open) { setForm(initial ?? empty); setErrors({}); } }, [open, initial]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!form.name.trim()) er.name = "Required";
    if (!form.address.trim()) er.address = "Required";
    if (!/^\d{6,15}$/.test(form.contact_no)) er.contact_no = "Invalid contact";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Invalid email";
    setErrors(er);
    if (Object.keys(er).length) return;
    onSave(initial ? { ...(initial as Hospital), ...form } : form);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{initial ? "Edit Hospital" : "Add Hospital"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {(["name","address","contact_no","email"] as const).map(k => (
            <div key={k} className="space-y-1">
              <Label className="capitalize">{k.replace("_", " ")}</Label>
              <Input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
              {errors[k] && <p className="text-xs text-destructive">{errors[k]}</p>}
            </div>
          ))}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initial ? "Save Changes" : "Add Hospital"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
