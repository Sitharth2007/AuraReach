import React from 'react';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  highlight = false,
  badgeText,
  onClick,
  className = ''
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-xl p-5 border transition-all duration-200 ${
        highlight
          ? 'border-[#C9A84C] shadow-card hover:shadow-hover'
          : 'border-[#E2D9D0] shadow-subtle hover:border-[#B85C6E]/40 hover:shadow-hover'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#7A6860]">
            {title}
          </p>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl lg:text-3xl font-bold tracking-tight text-[#1C1410] font-sans">
              {value}
            </span>
            {badgeText && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#C9A84C]/15 text-[#8A6A1F] border border-[#C9A84C]/30">
                {badgeText}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div
            className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
              highlight
                ? 'bg-[#C9A84C]/15 text-[#8A6A1F]'
                : 'bg-[#6B1A2A]/8 text-[#6B1A2A]'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-[#E2D9D0]/60 flex items-center justify-between text-xs text-[#7A6860]">
          <span>{subtitle}</span>
          {trend && (
            <span className="font-medium text-[#2D6A4F] flex items-center gap-1">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
