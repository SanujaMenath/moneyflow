import { Clock, UserPlus, UserMinus, Plus, Pen, Trash2, Crown, LogIn } from "lucide-react";
import type { ActivityLog } from "../../../types/collaboration";

interface ActivityHistoryProps {
  logs: ActivityLog[];
}

const actionConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  list_created: { label: "Created the list", icon: Plus, color: "text-blue-500" },
  member_joined: { label: "Joined the list", icon: LogIn, color: "text-green-500" },
  member_removed: { label: "Removed a member", icon: UserMinus, color: "text-rose-500" },
  ownership_transferred: { label: "Transferred ownership", icon: Crown, color: "text-amber-500" },
  invitation_sent: { label: "Sent invitation", icon: UserPlus, color: "text-blue-400" },
  expense_added: { label: "Added expense", icon: Plus, color: "text-emerald-500" },
  expense_edited: { label: "Edited expense", icon: Pen, color: "text-amber-500" },
  expense_deleted: { label: "Deleted expense", icon: Trash2, color: "text-rose-500" },
};

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const ActivityHistoryComponent = ({ logs }: ActivityHistoryProps) => {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h4 className="font-semibold text-slate-800 text-sm">Activity History</h4>
        </div>
        <div className="py-8 text-center">
          <Clock size={24} className="mx-auto text-slate-200 mb-2" />
          <p className="text-slate-400 text-xs">No activity yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <h4 className="font-semibold text-slate-800 text-sm">Activity History</h4>
      </div>
      <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto custom-scrollbar">
        {logs.map((log) => {
          const config = actionConfig[log.action] || { label: log.action, icon: Clock, color: "text-slate-400" };
          const Icon = config.icon;
          return (
            <div key={log.id} className="px-6 py-3 flex items-start gap-3 hover:bg-slate-50/40 transition-colors">
              <div className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 ${config.color}`}>
                <Icon size={13} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-700">
                  <span className="font-medium">{log.user_name}</span>{" "}
                  <span className="text-slate-500">{config.label}</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{formatTime(log.created_at)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
