import { useState } from "react";
import { X } from "lucide-react";
import { CURRENCIES } from "../../../context/CurrencyContext";

interface CreateSharedListDialogProps {
  onClose: () => void;
  onCreate: (name: string, description: string, currency: string) => Promise<void>;
}

export const CreateSharedListDialog = ({ onClose, onCreate }: CreateSharedListDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("LKR");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onCreate(name.trim(), description.trim(), currency);
      onClose();
    } catch (err) {
      alert("Failed to create list. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 bg-white rounded-t-2xl sm:rounded-2xl">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-text-primary">
          Create Shared List
        </h3>
        <button onClick={onClose} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-gray-100 transition-colors" aria-label="Close">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">List Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Apartment Expenses"
            className="p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            Description <span className="text-text-secondary font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this list for?"
            rows={3}
            className="p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            title="Select currency"
            className="p-3 border border-border rounded-xl text-sm bg-white"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.symbol} - {c.code}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-border text-text-secondary rounded-xl hover:bg-bg transition text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="flex-1 bg-navy text-white px-4 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all text-sm disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create List"}
          </button>
        </div>
      </form>
    </div>
  );
};
