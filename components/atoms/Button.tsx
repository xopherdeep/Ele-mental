import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  active = false,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs font-mono',
    md: 'px-3 py-1.5 text-xs font-mono',
    lg: 'px-4 py-2 text-sm font-mono',
  }[size];

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50 shadow-sm active:translate-y-0.5',
    secondary: 'bg-[#1e2230] hover:bg-[#282d3f] text-[#d8dceb] border border-[#2e3449] active:translate-y-0.5',
    ghost: 'bg-transparent hover:bg-white/5 text-[#a4acc4]',
    danger: 'bg-red-900/60 hover:bg-red-800/80 text-red-200 border border-red-700/60 active:translate-y-0.5',
    accent: 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/50 active:translate-y-0.5',
  }[variant];

  const activeClasses = active ? 'ring-2 ring-blue-400 border-blue-400 bg-[#2b3247] text-white' : '';

  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-md transition-all select-none disabled:opacity-40 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${activeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
