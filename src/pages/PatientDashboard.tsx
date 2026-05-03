import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, Droplet, User, Heart } from "lucide-react";
import { fmtDate, groupBadgeClasses, statusBadgeClasses } from "@/utils/helpers";
import { EmptyState } from "@/components/ui/states";
import StatCard from "@/components/dashboard/StatCard";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { requests } = useAppData();
  
  // Filter only current patient's requests
  // Since frontend gets filtered data from backend, it's already scoped
  const myRequests = [...requests].sort((a, b) => b.request_id - a.request_id).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display tracking-tight">Welcome, {user?.username}</h1>
        <p className="text-muted-foreground text-sm">Track your blood requests and donation history.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard 
          label="My Requests" 
          value={requests.length} 
          Icon={ClipboardList} 
          accent="primary" 
        />
        <StatCard 
          label="Pending Approval" 
          value={requests.filter((r: any) => r.status === "Pending").length} 
          Icon={Heart} 
          accent="amber" 
        />
        <Card className="glass relative overflow-hidden group">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center shrink-0 border border-emerald/20 transition-transform group-hover:scale-110">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Account Role</p>
              <p className="text-2xl font-bold tracking-tight">Patient</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Recent Blood Requests</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Showing last 5 requests</p>
            </div>
            <Badge className="bg-primary/5 border-primary/20 text-primary">Live Updates</Badge>
          </CardHeader>
          <CardContent>
            {myRequests.length === 0 ? (
              <EmptyState icon={<ClipboardList className="w-12 h-12" />} title="No requests found" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.map((r: any) => (
                    <TableRow key={r.request_id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-primary">#{r.request_id}</TableCell>
                      <TableCell>
                        <Badge className={groupBadgeClasses(r.blood_group)}>{r.blood_group}</Badge>
                      </TableCell>
                      <TableCell>{r.quantity} units</TableCell>
                      <TableCell className="text-muted-foreground">{fmtDate(r.request_date)}</TableCell>
                      <TableCell>
                        <Badge className={statusBadgeClasses(r.status)}>{r.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 flex items-center gap-6">
          <div className="p-3 rounded-full bg-primary/10 text-primary border border-primary/20">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Support & Assistance</h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              If you have any urgent blood requirements or questions regarding your request status, 
              please contact the administrator at <span className="text-primary font-medium">support@hemotrack.com</span> or call our 24/7 helpline.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
