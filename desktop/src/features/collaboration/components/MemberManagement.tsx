import { useState } from "react";
import { Mail, UserMinus, Crown, Send } from "lucide-react";
import type { SharedListMember } from "../../../types/collaboration";

interface MemberManagementProps {
  members: SharedListMember[];
  currentUserId: string;
  isOwner: boolean;
  listId: string;
  onInvite: (email: string) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
  onTransferOwnership: (userId: string) => Promise<void>;
}

export const MemberManagement = ({
  members, currentUserId, isOwner, onInvite, onRemove, onTransferOwnership,
}: MemberManagementProps) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setFeedback(null);
    try {
      await onInvite(email.trim());
      setEmail("");
      setFeedback({ ok: true, msg: "Invitation sent!" });
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback({ ok: false, msg: "Failed to send invitation." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <h4 className="font-semibold text-slate-800 text-sm">Members</h4>
        <p className="text-slate-400 text-xs mt-0.5">{members.length} member{members.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="divide-y divide-slate-50">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50/40 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-navy/40">
                  {member.display_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate flex items-center gap-1.5">
                  {member.display_name}
                  {member.role === "owner" && (
                    <Crown size={12} className="text-amber-400" />
                  )}
                  {member.user_id === currentUserId && (
                    <span className="text-[10px] text-slate-400 font-normal">(you)</span>
                  )}
                </p>
                <p className="text-xs text-slate-400 truncate">{member.email}</p>
              </div>
            </div>
            {isOwner && member.user_id !== currentUserId && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onTransferOwnership(member.user_id)}
                  className="p-1.5 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                  title="Transfer ownership"
                >
                  <Crown size={14} />
                </button>
                <button
                  onClick={() => onRemove(member.user_id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  title="Remove member"
                >
                  <UserMinus size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isOwner && (
        <form onSubmit={handleInvite} className="px-6 py-4 border-t border-slate-100 flex items-center gap-2">
          <div className="relative flex-1">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Invite by email..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={sending || !email.trim()}
            className="shrink-0 bg-navy text-white px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 hover:bg-navy/90 disabled:opacity-50"
          >
            <Send size={12} />
            {sending ? "Sending..." : "Invite"}
          </button>
          {feedback && (
            <span className={`text-xs font-medium ${feedback.ok ? "text-emerald-500" : "text-rose-500"}`}>
              {feedback.msg}
            </span>
          )}
        </form>
      )}
    </div>
  );
};
