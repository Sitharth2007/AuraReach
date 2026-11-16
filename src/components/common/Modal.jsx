import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
  footer
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1410]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div
        className={`relative w-full ${maxWidth} bg-[#FAF7F2] rounded-2xl border border-[#E2D9D0] shadow-modal overflow-hidden z-10 transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E2D9D0] bg-[#FFFFFF] flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1C1410] font-sans tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#7A6860] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A6860] hover:text-[#1C1410] hover:bg-[#F2EDE6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#E2D9D0] bg-[#F2EDE6]/50 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
