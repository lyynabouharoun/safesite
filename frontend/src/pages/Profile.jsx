import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import useAuth from "../hooks/useAuth";

export default function Profile() {
  const { getUser } = useAuth();

  // SAFE fallback (prevents blank screen crash)
  const user = getUser ? getUser() : null;

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Security Administrator",
    phone: "+1 555 000 0000",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "Operator",
        email: user.email || "",
        role: "Security Administrator",
        phone: "+1 555 000 0000",
      });
    }
  }, [user]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <motion.div className="mb-4">
        <h2 className="text-base font-medium text-cream">
          Profile & Account
        </h2>
        <p className="text-xs font-mono text-cream/30">
          Manage your operator identity
        </p>
      </motion.div>

      <div className="max-w-xl space-y-4">

        {/* AVATAR */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-plum flex items-center justify-center">
              <span className="text-cyan font-mono text-lg">
                {(user?.email || "OP").slice(0, 2).toUpperCase()}
              </span>
            </div>

            <div>
              <p className="text-sm text-cream">{form.name}</p>
              <p className="text-xs text-cream/30">{form.email}</p>
            </div>
          </div>
        </Card>

        {/* FORM */}
        <Card>
          <div className="space-y-3">
            <input
              className="w-full p-2 bg-dark-base text-cream border rounded"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="w-full p-2 bg-dark-base text-cream border rounded"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-cyan text-black rounded"
          >
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </Card>

      </div>
    </DashboardLayout>
  );
}