import { useState } from "react";
import { motion } from "framer-motion";

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
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h2 className="text-base font-medium text-cream">
          Profile & Account
        </h2>
        <p className="text-xs font-mono text-cream/30 mt-0.5">
          Manage your operator identity
        </p>
      </motion.div>

      <div className="max-w-xl space-y-4">

        {/* AVATAR */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <div className="flex items-center gap-4">

              <div className="relative w-16 h-16 rounded-full bg-plum border-2 border-cyan/30 flex items-center justify-center">
                <span className="font-mono text-xl text-cyan">OP</span>

                {/* live status ring */}
                <div className="absolute inset-0 rounded-full border border-cyan/30 animate-pulse" />
              </div>

              <div>
                <p className="text-sm font-medium text-cream">
                  {form.name}
                </p>

                <p className="text-xs font-mono text-cream/30">
                  {form.role}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 bg-cyan rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-cyan/70">
                    Active secure session
                  </span>
                </div>
              </div>

            </div>
          </Card>
        </motion.div>

        {/* DETAILS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <p className="font-mono text-xs text-cream/30 uppercase tracking-widest mb-4">
              Account Details
            </p>

            <div className="space-y-3">
              {[
                { label: "Full Name", key: "name", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Role", key: "role", type: "text" },
                { label: "Phone", key: "phone", type: "tel" },
              ].map((f) => (
                <motion.div
                  key={f.key}
                  whileFocus={{ scale: 1.01 }}
                  className="space-y-1"
                >
                  <label className="block text-xs font-mono text-cream/30 uppercase tracking-widest">
                    {f.label}
                  </label>

                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, [f.key]: e.target.value }))
                    }
                    className="w-full bg-dark-base border border-dark-border rounded-lg px-4 py-2.5 text-sm text-cream font-mono focus:outline-none focus:border-cyan transition-all"
                  />
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className={`mt-4 px-5 py-2 rounded-lg font-mono text-xs font-medium transition-all ${
                saved
                  ? "bg-cyan/10 text-cyan border border-cyan/30"
                  : "bg-cyan text-dark-base hover:bg-cyan/90"
              }`}
            >
              {saved ? "✓ Saved Securely" : "Save Changes"}
            </motion.button>
          </Card>
        </motion.div>

        {/* SECURITY */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <p className="font-mono text-xs text-cream/30 uppercase tracking-widest mb-4">
              Security Layer
            </p>

            <div className="space-y-3">
              {[
                { label: "Current Password" },
                { label: "New Password" },
                { label: "Confirm Password" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-mono text-cream/30 uppercase tracking-widest mb-1.5">
                    {f.label}
                  </label>

                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-dark-base border border-dark-border rounded-lg px-4 py-2.5 text-sm text-cream font-mono focus:outline-none focus:border-cyan transition"
                  />
                </div>
              ))}

              <button className="mt-2 px-5 py-2 rounded-lg font-mono text-xs bg-dark-base border border-dark-border text-cream/50 hover:text-cream hover:border-cyan/40 transition">
                Update Security Key
              </button>
            </div>
          </Card>
        </motion.div>

        {/* DANGER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <p className="font-mono text-xs text-coral/60 uppercase tracking-widest mb-4">
              Danger Zone
            </p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cream">
                  Deactivate Account
                </p>
                <p className="text-xs font-mono text-cream/30 mt-0.5">
                  Permanently disable operator access
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg font-mono text-xs border border-coral/30 text-coral/70 hover:text-coral hover:bg-coral/5 transition"
              >
                Deactivate
              </motion.button>
            </div>
          </Card>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}