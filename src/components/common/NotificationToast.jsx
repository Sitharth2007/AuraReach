import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function NotificationToast() {
  const { notification, closeNotification } = useApp();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#1C1410] text-[#FAF7F2] rounded-xl shadow-modal border border-[#C9A84C]/30 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-md">
      {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#C9A84C] shrink-0" />}
      {isError && <AlertCircle className="w-5 h-5 text-[#9E2A2B] shrink-0" />}
      {!isSuccess && !isError && <Info className="w-5 h-5 text-[#C9A84C] shrink-0" />}

      <p className="text-xs font-medium text-[#FAF7F2] flex-1 leading-relaxed">
        {notification.message}
      </p>

      <button
        onClick={closeNotification}
        className="p-1 rounded-md text-[#FAF7F2]/60 hover:text-[#FAF7F2] hover:bg-white/10 transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
