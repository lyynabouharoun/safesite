import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';

import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import useAuth from "../hooks/useAuth";

export default function Profile() {
  const { getUser, getAccessToken } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [updating, setUpdating] = useState(false);
  const nameInputRef = useRef(null);

  // Load user data
  useEffect(() => {
    const user = getUser();
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [getUser]);

  const handleSave = async () => {
    const token = getAccessToken();
    if (!token) {
      toast.error("Please login again");
      return;
    }

    // Get value from input field directly
    const nameToSave = nameInputRef.current?.value || name;

    try {
      const response = await fetch("http://localhost:8002/api/auth/update-profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: nameToSave }),
      });

      const data = await response.json();
      console.log("Save response:", data);

      if (response.ok) {
        // Update localStorage
        const currentUser = getUser();
        const updatedUser = { ...currentUser, name: data.user.name };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Update state
        setName(data.user.name);
        
        setSaved(true);
        toast.success('Profile updated!');
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Could not connect to server");
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordError("");
    setUpdating(true);

    const token = getAccessToken();
    try {
      const response = await fetch("http://localhost:8002/api/auth/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password changed successfully!');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("Could not connect to server");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" reverseOrder={false} />
      
      <motion.div className="mb-4">
        <h2 className="text-base font-medium text-cream">Profile & Account</h2>
        <p className="text-xs font-mono text-cream/30">Manage your operator identity</p>
      </motion.div>

      <div className="max-w-xl space-y-4">

        {/* AVATAR */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-plum flex items-center justify-center">
              <span className="text-cyan font-mono text-lg">
                {(email || "OP").slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm text-cream">{name || "No name"}</p>
              <p className="text-xs text-cream/30">{email}</p>
            </div>
          </div>
        </Card>

        {/* FORM */}
        <Card>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-cream/50 mb-1 block">Full Name</label>
              <input
                ref={nameInputRef}
                type="text"
                className="w-full p-2 bg-dark-base text-cream border border-dark-border rounded focus:border-cyan focus:outline-none"
                defaultValue={name}
              />
            </div>

            <div>
              <label className="text-xs text-cream/50 mb-1 block">Email</label>
              <input
                type="email"
                className="w-full p-2 bg-dark-base text-cream/50 border border-dark-border rounded"
                value={email}
                disabled
              />
              <p className="text-xs text-cream/30 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="text-xs text-cream/50 mb-1 block">Role</label>
              <input
                className="w-full p-2 bg-dark-base text-cream/50 border border-dark-border rounded"
                value="Security Administrator"
                disabled
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-cyan text-black rounded hover:bg-cyan/80 transition"
            >
              {saved ? "Saved!" : "Save Changes"}
            </button>
            
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-dark-card border border-dark-border text-cyan rounded hover:border-cyan/50 transition"
            >
              Change Password
            </button>
          </div>
        </Card>

      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-card rounded-xl p-6 w-full max-w-md border border-dark-border"
          >
            <h3 className="text-lg font-semibold text-cream mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-cream/50 mb-1 block">Current Password</label>
                <input
                  type="password"
                  className="w-full p-2 bg-dark-base text-cream border border-dark-border rounded focus:border-cyan focus:outline-none"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-xs text-cream/50 mb-1 block">New Password</label>
                <input
                  type="password"
                  className="w-full p-2 bg-dark-base text-cream border border-dark-border rounded focus:border-cyan focus:outline-none"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-xs text-cream/50 mb-1 block">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full p-2 bg-dark-base text-cream border border-dark-border rounded focus:border-cyan focus:outline-none"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
              
              {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleChangePassword}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-cyan text-black rounded hover:bg-cyan/80 transition disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Password"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError("");
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                className="px-4 py-2 bg-dark-card border border-dark-border text-cream rounded hover:border-red-500/50 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}