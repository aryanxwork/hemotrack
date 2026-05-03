import { useMemo, useState } from "react";
import { useAppData } from "@/context/AppDataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { fmtDate, statusBadgeClasses } from "@/utils/helpers";
import { format, parseISO } from "date-fns";
import { EmptyState } from "@/components/ui/states";
import { ScrollText } from "lucide-react";

export default function AuditLog() {
  const { audits } = useAppData();
  const [filter, setFilter] = useState("all");
  const actions = useMemo(() => Array.from(new Set(audits.map(a => a.action))), [audits]);
  const rows = useMemo(() =>
    audits.filter(a => filter === "all" || a.action === filter)
          .sort((a, b) => b.log_id - a.log_id),
    [audits, filter]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {actions.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        {rows.length === 0 ? <EmptyState icon={<ScrollText />} title="No audit entries" /> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Log ID</TableHead><TableHead>Admin</TableHead><TableHead>Action</TableHead>
                <TableHead>Table</TableHead><TableHead>Record ID</TableHead><TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(a => (
                <TableRow key={a.log_id}>
                  <TableCell>#{a.log_id}</TableCell>
                  <TableCell>Admin #{a.admin_id}</TableCell>
                  <TableCell><Badge className={statusBadgeClasses("Approved")}>{a.action}</Badge></TableCell>
                  <TableCell>{a.table_name}</TableCell>
                  <TableCell>#{a.record_id}</TableCell>
                  <TableCell>{format(parseISO(a.log_time), "dd MMM yyyy HH:mm")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
