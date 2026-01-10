import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  shimmer = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-xl
    transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

  const variants = {
    primary: shimmer ? `
      btn-primary-shimmer
    ` : `
      relative overflow-hidden
      bg-gradient-to-br from-primary to-primary-light text-white 
      focus:ring-primary shadow-lg
      hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(15,118,110,0.3),0_5px_15px_rgba(0,0,0,0.1)]
      active:translate-y-0 active:scale-[0.98]
    `,
    secondary: `
      relative overflow-hidden
      bg-gradient-to-br from-secondary to-secondary-light text-white 
      focus:ring-secondary shadow-lg
      hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(251,113,133,0.3),0_5px_15px_rgba(0,0,0,0.1)]
      active:translate-y-0 active:scale-[0.98]
    `,
    outline: `
      border-2 border-primary text-primary bg-transparent
      hover:bg-primary hover:text-white focus:ring-primary
      hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(15,118,110,0.2)]
      active:translate-y-0 active:scale-[0.98]
    `,
    ghost: `
      text-text hover:bg-surface-hover focus:ring-primary
      hover:-translate-y-0.5
    `,
    accent: `
      relative overflow-hidden
      bg-gradient-to-br from-accent-dark to-accent text-text 
      hover:text-white focus:ring-accent shadow-lg
      hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(251,191,36,0.3),0_5px_15px_rgba(0,0,0,0.1)]
      active:translate-y-0 active:scale-[0.98]
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  // Add shimmer pseudo element via inline style for primary shimmer variant
  const shimmerStyles = variant === 'primary' && shimmer ? {} : {};

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim().replace(/\s+/g, ' ')}
      style={shimmerStyles}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </button>
  );
};

export default Button;
