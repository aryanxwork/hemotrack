import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { BLOOD_GROUPS } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Check, X, ClipboardList } from "lucide-react";
import RequestModal from "@/components/requests/RequestModal";
import { fmtDate, groupBadgeClasses, statusBadgeClasses } from "@/utils/helpers";
import { TableSkeleton, EmptyState, useFakeLoad } from "@/components/ui/states";

export default function Requests() {
  const { role } = useAuth();
  const { requests, hospitals, approveRequest, rejectRequest } = useAppData();
  const [statusF, setStatusF] = useState("all");
  const [groupF, setGroupF] = useState("all");
  const [open, setOpen] = useState(false);
  const loading = useFakeLoad([requests.length]);

  const filtered = useMemo(() => requests.filter(r =>
    (statusF === "all" || r.status === statusF) &&
    (groupF === "all" || r.blood_group === groupF)
  ).sort((a, b) => b.request_id - a.request_id), [requests, statusF, groupF]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <Select value={statusF} onValueChange={setStatusF}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {["Pending","Approved","Rejected"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={groupF} onValueChange={setGroupF}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blood Groups</SelectItem>
              {BLOOD_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex-1" />
          <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> New Request</Button>
        </CardContent>
      </Card>

      <Card>
        {loading ? <TableSkeleton cols={7} /> : filtered.length === 0 ? (
          <EmptyState icon={<ClipboardList />} title="No requests" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>Hospital</TableHead><TableHead>Group</TableHead>
                <TableHead>Qty</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => {
                const h = hospitals.find(x => x.hospital_id === r.hospital_id);
                const processed = r.status !== "Pending";
                const ApproveBtn = (
                  <Button size="sm" variant="outline" disabled={processed}
                    onClick={async () => { const res = await approveRequest(r.request_id); res.ok ? toast.success(res.message) : toast.error(res.message); }}>
                    <Check className="w-4 h-4" /> Approve
                  </Button>
                );
                const RejectBtn = (
                  <Button size="sm" variant="outline" disabled={processed}
                    onClick={async () => { const res = await rejectRequest(r.request_id); res.ok ? toast.success(res.message) : toast.error(res.message); }}>
                    <X className="w-4 h-4" /> Reject
                  </Button>
                );
                return (
                  <TableRow key={r.request_id}>
                    <TableCell>#{r.request_id}</TableCell>
                    <TableCell>{h?.name ?? "—"}</TableCell>
                    <TableCell><Badge className={groupBadgeClasses(r.blood_group)}>{r.blood_group}</Badge></TableCell>
                    <TableCell>{r.quantity}</TableCell>
                    <TableCell>{fmtDate(r.request_date)}</TableCell>
                    <TableCell><Badge className={statusBadgeClasses(r.status)}>{r.status}</Badge></TableCell>
                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      {role !== "Patient" && (
                        processed ? (
                          <>
                            <Tooltip><TooltipTrigger asChild><span>{ApproveBtn}</span></TooltipTrigger><TooltipContent>Already processed</TooltipContent></Tooltip>
                            <Tooltip><TooltipTrigger asChild><span>{RejectBtn}</span></TooltipTrigger><TooltipContent>Already processed</TooltipContent></Tooltip>
                          </>
                        ) : (<>{ApproveBtn}{RejectBtn}</>)
                      )}
                      {role === "Patient" && <span className="text-xs text-muted-foreground italic">Pending Review</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <RequestModal open={open} onClose={() => { setOpen(false); }} />
    </div>
  );
}
