import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAppData } from "@/context/AppDataContext";

const COLORS = { Pending: "#F59E0B", Approved: "hsl(var(--primary))", Rejected: "#71717A" };

export default function RequestStatusPie() {
  const { requests } = useAppData();
  const data = (["Pending", "Approved", "Rejected"] as const).map(s => ({
    name: s, value: requests.filter(r => r.status === s).length,
  })).filter(d => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
          {data.map(d => <Cell key={d.name} fill={COLORS[d.name]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
