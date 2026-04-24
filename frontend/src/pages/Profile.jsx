import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";

export default function Profile() {
  const [form, setForm] = useState({
    name: "Operator",
    email: "operator@safesite.io",
    role: "Security Administrator",
    phone: "+1 555 000 0000",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-base font-medium text-cream">Profile & Account</h2>
        <p className="text-xs font-mono text-cream/30 mt-0.5">Manage your operator identity</p>
      </div>

      <div className="max-w-xl space-y-4">
        {/* Avatar block */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-plum border-2 border-cyan/30 flex items-center justify-center flex-shrink-0">
              <span className="font-mono text-xl text-cyan">OP</span>
            </div>
            <div>
              <p className="text-sm font-medium text-cream">{form.name}</p>
              <p className="text-xs font-mono text-cream/30">{form.role}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan inline-block" />
                <span className="font-mono text-xs text-cyan/70">Active session</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Editable fields */}
        <Card>
          <p className="font-mono text-xs text-cream/30 uppercase tracking-widest mb-4">Account Details</p>
          <div className="space-y-3">
            {[
              { label: "Full Name",    key: "name",  type: "text"  },
              { label: "Email",        key: "email", type: "email" },
              { label: "Role",         key: "role",  type: "text"  },
              { label: "Phone",        key: "phone", type: "tel"   },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-mono text-cream/30 uppercase tracking-widest mb-1.5">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  className="w-full bg-dark-base border border-dark-border rounded-lg px-4 py-2.5 text-sm text-cream font-mono placeholder:text-cream/20 focus:outline-none focus:border-cyan transition-colors"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className={`mt-4 px-5 py-2 rounded-lg font-mono text-xs font-medium transition-all
              ${saved
                ? "bg-cyan/10 text-cyan border border-cyan/30"
                : "bg-cyan text-dark-base hover:bg-cyan/90 active:scale-[0.98]"
              }`}
          >
            {saved ? "✓ Saved" : "Save Changes"}
          </button>
        </Card>

        {/* Security */}
        <Card>
          <p className="font-mono text-xs text-cream/30 uppercase tracking-widest mb-4">Security</p>
          <div className="space-y-3">
            {[
              { label: "Current Password", placeholder: "••••••••" },
              { label: "New Password",     placeholder: "••••••••" },
              { label: "Confirm Password", placeholder: "••••••••" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-mono text-cream/30 uppercase tracking-widest mb-1.5">
                  {f.label}
                </label>
                <input
                  type="password"
                  placeholder={f.placeholder}
                  className="w-full bg-dark-base border border-dark-border rounded-lg px-4 py-2.5 text-sm text-cream font-mono placeholder:text-cream/20 focus:outline-none focus:border-cyan transition-colors"
                />
              </div>
            ))}
            <button className="mt-1 px-5 py-2 rounded-lg font-mono text-xs font-medium bg-dark-base border border-dark-border text-cream/50 hover:text-cream hover:border-cyan/40 transition-all">
              Update Password
            </button>
          </div>
        </Card>

        {/* Danger zone */}
        <Card>
          <p className="font-mono text-xs text-coral/50 uppercase tracking-widest mb-4">Danger Zone</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cream">Deactivate Account</p>
              <p className="text-xs font-mono text-cream/30 mt-0.5">Permanently disable this operator account</p>
            </div>
            <button className="px-4 py-2 rounded-lg font-mono text-xs font-medium border border-coral/30 text-coral/60 hover:text-coral hover:bg-coral/5 transition-all">
              Deactivate
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}