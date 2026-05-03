import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useAppData } from "@/context/AppDataContext";
import { BLOOD_GROUPS } from "@/types";

export default function BloodGroupChart() {
  const { units } = useAppData();
  const data = BLOOD_GROUPS.map(g => ({
    group: g,
    count: units.filter(u => u.blood_group === g && u.status === "Available").length,
  }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="crimson" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary-glow))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="group" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
        <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} cursor={{ fill: "hsl(var(--primary)/0.08)" }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill="url(#crimson)" />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
