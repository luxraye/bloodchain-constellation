import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, Upload, CheckCircle2, Loader2, CalendarHeart, BellRing } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Helper for animations
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function DonorProfile({ profile, session, onProfileUpdate }: any) {
  const [uploading, setUploading] = useState(false);
  const [kycError, setKycError] = useState('');

  const trustLevel = profile?.trustLevel || 1;

  const handleFileUpload = async (event: any) => {
    try {
      setUploading(true);
      setKycError('');
      
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${session.id}/omang_id_${Date.now()}.${fileExt}`;
      
      // Upload to donor-kyc bucket
      const { error: uploadError } = await supabase.storage
        .from('donor-kyc')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the URL
      const { data: { publicUrl } } = supabase.storage
        .from('donor-kyc')
        .getPublicUrl(filePath);

      // Trigger Profile Update to Trust Level 2 (Pending Verification)
      // In a real app we would call a backend protected route, but we mock the update via the props
      const updatedProfile = { 
        ...profile, 
        trustLevel: 2, 
        verificationDocUrl: publicUrl 
      };
      
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }

    } catch (error: any) {
      setKycError(error.message || 'Error uploading KYC document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div 
      variants={fadeUp} 
      initial="hidden" 
      animate="visible" 
      className="space-y-6 pb-6"
    >
      <header className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Trust & Identity
        </h2>
        <p className="text-sm text-slate-500">
          Secure digital health verification.
        </p>
      </header>

      {/* TIER 1 - UNVERIFIED */}
      {trustLevel === 1 && (
        <motion.section 
          variants={fadeUp}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft-card"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Level 1: Unverified</h3>
              <p className="text-sm text-slate-500 mt-1">
                You can view upcoming blood drives, but you cannot book appointments or donate yet.
              </p>
            </div>
          </div>
          
          <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-100">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Upgrade to Level 2</h4>
            <p className="text-xs text-slate-600 mb-4">
              Please upload a clear photo of your National ID (Omang) to proceed to health screening.
            </p>
            
            <div className="relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
              />
              <div className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors ${uploading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? 'Uploading ID...' : 'Upload National ID'}
              </div>
            </div>
            {kycError && <p className="mt-2 text-xs text-red-600">{kycError}</p>}
          </div>
        </motion.section>
      )}

      {/* TIER 2 - SCREENED / PENDING VERIFICATION */}
      <AnimatePresence>
        {trustLevel === 2 && (
          <motion.section 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 shadow-inner relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Shield className="h-32 w-32 text-indigo-900" />
            </div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-200 text-indigo-700">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-indigo-900">Level 2: Pending Audit</h3>
                <p className="text-sm text-indigo-700/80 mt-1">
                  Your identity document has been uploaded securely to the MoH. A High Command auditor is reviewing your profile.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-indigo-800 bg-indigo-200/50 py-2 px-3 rounded-lg w-max">
              <CalendarHeart className="h-4 w-4" />
              Questionnaire complete
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* TIER 3 - FULLY VERIFIED */}
      <AnimatePresence>
        {trustLevel === 3 && (
          <motion.section 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 shadow-soft-card relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 opacity-[0.03]">
              <ShieldCheck className="h-40 w-40 text-emerald-900" />
            </div>
            <div className="flex items-start gap-4 relative z-10 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full shadow-sm bg-emerald-500 text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-900">Level 3: Verified Donor</h3>
                <p className="text-sm text-emerald-700 mt-1 pb-1">
                  You have full MoH clearance. Thank you for your continued service.
                </p>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                <CalendarHeart className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">VIP Donation Slots Unlocked</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                <BellRing className="h-5 w-5 text-rose-500" />
                <span className="text-sm font-medium text-slate-700">Urgent Regional shortage alerts active</span>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
