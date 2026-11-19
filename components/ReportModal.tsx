'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  profileName: string;
  profileId: string;
  onClose: () => void;
  onReportSuccess: () => void;
}

const REPORT_REASONS = [
  'Fake profile or impersonation',
  'Inappropriate or offensive photos',
  'Harassment or disrespectful behavior',
  'Commercial spam or advertising',
  'Underage / violates guidelines'
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  profileName,
  profileId,
  onClose,
  onReportSuccess
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(REPORT_REASONS[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          reason: selectedReason
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onReportSuccess();
          onClose();
        }, 1400);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-white rounded-3xl p-6 text-slate-800 shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 animate-bounce" />
                <h4 className="text-lg font-bold text-slate-900">Report Received</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  {profileName} has been blocked and permanently removed from your feed and matches.
                </p>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-3 border border-rose-100">
                  <ShieldAlert className="w-6 h-6" />
                </div>

                <h3 className="font-bold text-lg text-slate-900">
                  Report & Block {profileName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Help keep Coy safe and confidential. They will not be notified of this action.
                </p>

                <div className="mt-4 space-y-2">
                  {REPORT_REASONS.map((reason) => (
                    <label
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        selectedReason === reason
                          ? 'border-rose-500 bg-rose-50/50 text-rose-950 font-medium'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="accent-rose-500"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200"
                  >
                    {loading ? 'Submitting...' : 'Block & Report'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
