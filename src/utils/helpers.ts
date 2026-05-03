import { format, parseISO, isBefore, startOfDay } from "date-fns";
import type { BloodGroup } from "@/types";

export const fmtDate = (d: string | Date) => {
  if (!d) return "—";
  const date = typeof d === "string" ? parseISO(d) : d;
  return format(date, "dd MMM yyyy");
};

export const isExpired = (expiry: string) =>
  isBefore(parseISO(expiry), startOfDay(new Date()));

export const todayISO = () => format(new Date(), "yyyy-MM-dd");

export const groupBadgeClasses = (g: BloodGroup): string => {
  if (g.startsWith("AB")) return "bg-orange-500/15 text-orange-400 border-orange-500/30";
  if (g.startsWith("A")) return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  if (g.startsWith("B")) return "bg-purple-500/15 text-purple-400 border-purple-500/30";
  return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"; // O
};

export const statusBadgeClasses = (s: string): string => {
  switch (s) {
    case "Available": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "Expired": return "bg-red-500/15 text-red-400 border-red-500/30";
    case "Pending": return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "Approved": return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    case "Rejected":
    case "Issued":
    default: return "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
  }
};

export function exportCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => escape(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
