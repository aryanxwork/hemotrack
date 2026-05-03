import { useEffect, useState } from "react";
import type { Donor, BloodGroup } from "@/types";
import { BLOOD_GROUPS } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Props {
  open: boolean; onClose: () => void;
  initial?: Donor | null;
  onSave: (data: Omit<Donor, "donor_id"> | Donor) => void;
}

const empty: Omit<Donor, "donor_id"> = {
  name: "", age: 18, gender: "Male", blood_group: "O+",
  phone: "", email: "", address: "", last_donation_date: "",
};

export default function DonorModal({ open, onClose, initial, onSave }: Props) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial } : empty);
      setErrors({});
    }
  }, [open, initial]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (form.age < 18 || form.age > 65) e.age = "Age must be 18–65";
    if (!/^\d{10,15}$/.test(form.phone)) e.phone = "Enter valid phone";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.address.trim()) e.address = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave(initial ? { ...(initial as Donor), ...form } : form);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Donor" : "Add Donor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1">
            <Label>Name</Label>
            <Input value={form.name} onChange={e => set("name", e.target.value)} />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <Label>Age</Label>
            <Input type="number" value={form.age} onChange={e => set("age", Number(e.target.value))} />
            {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
          </div>
          <div className="space-y-1">
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v: any) => set("gender", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["Male","Female","Other"] as const).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Blood Group</Label>
            <Select value={form.blood_group} onValueChange={(v) => set("blood_group", v as BloodGroup)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {BLOOD_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={e => set("phone", e.target.value)} />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>
          <div className="sm:col-span-2 space-y-1">
            <Label>Email</Label>
            <Input value={form.email} onChange={e => set("email", e.target.value)} />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="sm:col-span-2 space-y-1">
            <Label>Address</Label>
            <Input value={form.address} onChange={e => set("address", e.target.value)} />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>
          <div className="sm:col-span-2 space-y-1">
            <Label>Last Donation Date</Label>
            <Input type="date" value={form.last_donation_date} onChange={e => set("last_donation_date", e.target.value)} />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initial ? "Save Changes" : "Add Donor"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
