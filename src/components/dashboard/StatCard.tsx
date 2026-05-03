import { Card } from "@/components/ui/card";
import { useCountUp } from "@/hooks/useCountUp";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatCard({
  label, value, Icon, accent = "primary",
}: { label: string; value: number; Icon: LucideIcon; accent?: "primary" | "amber" | "emerald" | "blue" }) {
  const display = useCountUp(value);
  const colorMap = {
    primary: "text-primary bg-primary/10 border-primary/30",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  };
  return (
    <Card className="p-5 flex items-center justify-between hover:glow-border transition-all">
      <div>
        <p className="text-sm text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="font-display text-5xl mt-1">{display}</p>
      </div>
      <div className={cn("w-14 h-14 rounded-lg flex items-center justify-center border", colorMap[accent])}>
        <Icon className="w-7 h-7" />
      </div>
    </Card>
  );
}
