import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';

import DashboardLayout from "../components/layout/DashboardLayout";
import StatsRow from "../components/dashboard/StatsRow";
import AlertPanel from "../components/dashboard/AlertPanel";
import { useAlerts } from "../context/AlertsContext";

export default function Dashboard() {
  const { alerts, fetchAlerts } = useAlerts();

  const [video, setVideo] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // NEW: loading state

  const metrics = {
    cameras: 3,
    alerts: alerts.length,
    fps: 30,
    events: alerts.length,
    uptime: "2h",
  };

  // Get LAST 5 alerts only (most recent)
  const latestAlerts = (alerts ?? []).slice(-5).reverse();

  // Helper to get auth token
  const getAuthToken = () => {
    return localStorage.getItem("access_token");
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 3000 }} />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <StatsRow metrics={metrics} alerts={alerts} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-4 space-y-4"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan rounded-full animate-pulse"></div>
              <h2 className="text-sm font-semibold text-cyan">Upload Video for Analysis</h2>
            </div>
            
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              className="text-sm text-cream w-full p-2 border border-dark-border rounded-lg bg-dark-base"
              disabled={isAnalyzing}
            />

            {video && !isAnalyzing && (
              <video
                controls
                className="w-full rounded-lg border border-dark-border"
                src={URL.createObjectURL(video)}
              />
            )}

            {/* Loading animation while analyzing */}
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 space-y-3"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-cyan/20 rounded-full animate-spin border-t-cyan"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                  </div>
                </div>
                <p className="text-cyan font-medium">Analyzing video...</p>
                <p className="text-gray-400 text-xs">AI is processing each frame for violence detection</p>
                <div className="flex gap-1 mt-2">
                  <div className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </motion.div>
            )}

            <button
              onClick={async () => {
                if (!video) {
                  toast.error('Please select a video first');
                  return;
                }
                
                // Show loading state
                setIsAnalyzing(true);
                
                const formData = new FormData();
                formData.append('video', video);
                formData.append('camera_id', 1);
                
                try {
                  const token = getAuthToken();
                  const response = await fetch('http://localhost:8000/api/upload-video/', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    },
                    body: formData
                  });
                  
                  if (response.status === 401) {
                    toast.error('Session expired. Please login again.');
                    localStorage.clear();
                    window.location.href = '/login';
                    return;
                  }
                  
                  const result = await response.json();
                  
                  if (result.alert_created === 1) {
                    toast.success('🚨 VIOLENCE DETECTED!', {
                      duration: 4000,
                      icon: '🔴',
                      style: { background: '#dc2626', color: '#fff' }
                    });
                    
                    const audio = new Audio('/alert.mp3');
                    audio.play().catch(e => console.log('Sound error:', e));
                  } else {
                    toast.success('✅ No violence detected', {
                      duration: 2000,
                      icon: '🟢',
                      style: { background: '#10b981', color: '#fff' }
                    });
                  }
                  
                  await fetchAlerts();
                  
                } catch (error) {
                  toast.error('❌ Error processing video');
                  console.error('Upload error:', error);
                } finally {
                  // Hide loading state
                  setIsAnalyzing(false);
                }
              }}
              disabled={isAnalyzing}
              className={`w-full px-4 py-2 text-sm rounded-lg transition font-semibold ${
                isAnalyzing 
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' 
                  : 'bg-cyan/20 text-cyan hover:bg-cyan/30'
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-cyan/30 rounded-full animate-spin border-t-cyan"></span>
                  Analyzing...
                </span>
              ) : (
                '🎬 Send to AI Service'
              )}
            </button>

          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertPanel alerts={latestAlerts} />
        </motion.div>

      </div>
    </DashboardLayout>
  );
}