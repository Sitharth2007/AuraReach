import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#8B2535] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-[#6B1A2A] text-[#FAF7F2] hover:bg-[#8B2535] active:bg-[#4E111E] shadow-sm hover:shadow',
    secondary: 'bg-[#FFFFFF] text-[#1C1410] border border-[#E2D9D0] hover:bg-[#F2EDE6] active:bg-[#E8E1D7]',
    gold: 'bg-[#C9A84C] text-[#1C1410] font-semibold hover:bg-[#B8983E] active:bg-[#9E8030] shadow-sm',
    ghost: 'bg-transparent text-[#6B1A2A] hover:bg-[#F2EDE6] active:bg-[#E8E1D7]',
    danger: 'bg-[#9E2A2B] text-white hover:bg-[#851F20] active:bg-[#6D1516]',
    outline: 'border border-[#6B1A2A] text-[#6B1A2A] bg-transparent hover:bg-[#6B1A2A]/5'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
