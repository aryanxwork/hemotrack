import { useAppData } from "@/context/AppDataContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatCard from "@/components/dashboard/StatCard";
import BloodGroupChart from "@/components/dashboard/BloodGroupChart";
import RequestStatusPie from "@/components/dashboard/RequestStatusPie";
import { Users, Droplets, ClipboardList, Building2 } from "lucide-react";
import { fmtDate, groupBadgeClasses } from "@/utils/helpers";
import { EmptyState } from "@/components/ui/states";

export default function Dashboard() {
  const { donors, units, requests, hospitals, issues, admins = [] } = useAppData() as any;
  const recent = [...issues].sort((a, b) => b.issue_id - a.issue_id).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Donors" value={donors.length} Icon={Users} accent="primary" />
        <StatCard label="Available Units" value={units.filter((u: any) => u.status === "Available").length} Icon={Droplets} accent="emerald" />
        <StatCard label="Pending Requests" value={requests.filter((r: any) => r.status === "Pending").length} Icon={ClipboardList} accent="amber" />
        <StatCard label="Hospitals" value={hospitals.length} Icon={Building2} accent="blue" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Blood Group Availability</CardTitle></CardHeader>
          <CardContent><BloodGroupChart /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Request Status</CardTitle></CardHeader>
          <CardContent><RequestStatusPie /></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <EmptyState icon={<ClipboardList />} title="No recent issues" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue ID</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Handled By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((i: any) => {
                  const unit = units.find((u: any) => u.unit_id === i.unit_id);
                  const hosp = hospitals.find((h: any) => h.hospital_id === i.hospital_id);
                  return (
                    <TableRow key={i.issue_id}>
                      <TableCell>#{i.issue_id}</TableCell>
                      <TableCell>
                        {unit && <Badge className={groupBadgeClasses(unit.blood_group)}>{unit.blood_group}</Badge>}
                      </TableCell>
                      <TableCell>{hosp?.name ?? "—"}</TableCell>
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
