import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';

import DashboardLayout from "../components/layout/DashboardLayout";
import StatsRow from "../components/dashboard/StatsRow";
import AlertPanel from "../components/dashboard/AlertPanel";
import { useAlerts } from "../context/AlertsContext";

export default function Dashboard() {
  const { alerts, fetchAlerts } = useAlerts();

  const [video, setVideo] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const metrics = {
    cameras: 3,
    alerts: alerts.length,
    fps: 30,
    events: alerts.length,
    uptime: "2h",
  };

  const latestAlerts = (alerts ?? []).slice(-5).reverse();

  const getAuthToken = () => {
    return localStorage.getItem("access_token");
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setVideo(file);
        toast.success('Video loaded!', { icon: '📹', duration: 1500 });
      } else {
        toast.error('Please drop a valid video file');
      }
    }
  };

  const analyzeVideo = async () => {
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
          duration: 5000,
          icon: '🔴',
          style: { background: '#dc2626', color: '#fff', fontWeight: 'bold' }
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
      setIsAnalyzing(false);
    }
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
          className="lg:col-span-2"
        >
          {/* Upload Card */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan rounded-full animate-pulse"></div>
              <h2 className="text-sm font-semibold text-cyan">Upload Video for Analysis</h2>
            </div>
            
            {/* Drag & Drop Area */}
            <div
              className={`relative transition-all duration-200 ${
                dragActive ? 'ring-2 ring-cyan ring-offset-2 ring-offset-dark-card rounded-lg' : ''
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label className={`
                flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                transition-all duration-200
                ${dragActive 
                  ? 'border-cyan bg-cyan/5' 
                  : 'border-dark-border hover:border-cyan/50 hover:bg-dark-base/50'
                }
                ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}
              `}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="text-3xl mb-2">📹</div>
                  <p className="text-sm text-cream/70">
                    <span className="font-semibold text-cyan">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-cream/40 mt-1">MP4, AVI, MOV (Max 100MB)</p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => e.target.files[0] && setVideo(e.target.files[0])}
                  disabled={isAnalyzing}
                />
              </label>
            </div>

            {/* Video Preview */}
            <AnimatePresence>
              {video && !isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative"
                >
                  <video
                    controls
                    className="w-full rounded-lg border border-dark-border"
                    src={URL.createObjectURL(video)}
                  />
                  <button
                    onClick={() => setVideo(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-red-500 transition"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading Animation */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-8 space-y-3 bg-dark-base/50 rounded-lg"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-cyan/20 rounded-full animate-spin border-t-cyan"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl animate-pulse">🤖</span>
                    </div>
                  </div>
                  <p className="text-cyan font-medium">AI is analyzing...</p>
                  <p className="text-gray-400 text-xs">Scanning each frame for violence detection</p>
                  <div className="flex gap-1.5 mt-2">
                    <div className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    <div className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0.45s' }}></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={analyzeVideo}
                disabled={!video || isAnalyzing}
                className={`
                  flex-1 px-4 py-2.5 text-sm rounded-lg transition-all font-semibold
                  flex items-center justify-center gap-2
                  ${!video || isAnalyzing
                    ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/25 transform hover:scale-[1.02]'
                  }
                `}
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 rounded-full animate-spin border-t-white"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span>🎬</span>
                    Send to AI Service
                  </>
                )}
              </button>

              {video && !isAnalyzing && (
                <button
                  onClick={() => setVideo(null)}
                  className="px-4 py-2.5 text-sm rounded-lg bg-dark-card border border-dark-border text-cream/70 hover:border-red-500/50 hover:text-red-400 transition-all"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Tips Section */}
            <div className="mt-4 pt-3 border-t border-dark-border">
              <div className="flex items-center gap-2 text-xs text-cream/40">
                <span className="w-4 h-4 rounded-full bg-cyan/20 flex items-center justify-center">💡</span>
                <span>For best results, upload clear videos with good lighting</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alert Panel */}
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