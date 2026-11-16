import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false
}) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  const variantStyles = {
    // Priorities
    high: 'bg-[#6B1A2A]/10 text-[#6B1A2A] border border-[#6B1A2A]/25',
    medium: 'bg-[#C9A84C]/15 text-[#8A6A1F] border border-[#C9A84C]/35',
    low: 'bg-[#7A6860]/10 text-[#7A6860] border border-[#7A6860]/20',

    // Statuses
    success: 'bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/25',
    warning: 'bg-[#B45309]/10 text-[#B45309] border border-[#B45309]/25',
    error: 'bg-[#9E2A2B]/10 text-[#9E2A2B] border border-[#9E2A2B]/25',
    gold: 'bg-[#C9A84C]/20 text-[#8A6A1F] border border-[#C9A84C]/40',
    burgundy: 'bg-[#6B1A2A] text-[#FAF7F2] border border-[#6B1A2A]',
    
    // Default neutral
    default: 'bg-[#F2EDE6] text-[#1C1410] border border-[#E2D9D0]',
    muted: 'bg-[#F2EDE6]/60 text-[#7A6860] border border-[#E2D9D0]/60'
  };

  // Helper mapping common text to variant
  let finalVariant = variant;
  const lower = String(children || '').toLowerCase().trim();
  if (variant === 'default') {
    if (lower === 'high' || lower === 'high priority') finalVariant = 'high';
    else if (lower === 'medium' || lower === 'medium priority') finalVariant = 'medium';
    else if (lower === 'low' || lower === 'low priority') finalVariant = 'low';
    else if (lower === 'interested' || lower === 'sent' || lower === 'completed' || lower === 'active') finalVariant = 'success';
    else if (lower === 'pending approval' || lower === 'scheduled' || lower === 'negotiation') finalVariant = 'warning';
    else if (lower === 'contacted' || lower === 'in follow-up' || lower === 'unread') finalVariant = 'burgundy';
    else if (lower === 'needs more information') finalVariant = 'gold';
    else if (lower === 'not interested' || lower === 'archived') finalVariant = 'muted';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full transition-colors ${sizeStyles[size]} ${variantStyles[finalVariant] || variantStyles.default} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      )}
      {children}
    </span>
  );
}
