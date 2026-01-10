import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon: Icon,
    iconPosition = 'left',
    ...props
}) => {
    const baseStyles = `
    inline-flex items-center justify-center gap-2 font-semibold rounded-xl
    transition-all duration-300 ease-out cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

    const variants = {
        primary: `
      bg-primary text-white hover:bg-primary-dark 
      focus:ring-primary shadow-lg hover:shadow-xl
      hover:scale-[1.02] active:scale-[0.98]
    `,
        secondary: `
      bg-secondary text-white hover:bg-secondary-dark 
      focus:ring-secondary shadow-lg hover:shadow-xl
      hover:scale-[1.02] active:scale-[0.98]
    `,
        outline: `
      border-2 border-primary text-primary bg-transparent
      hover:bg-primary hover:text-white focus:ring-primary
      hover:scale-[1.02] active:scale-[0.98]
    `,
        ghost: `
      text-text hover:bg-surface-hover focus:ring-primary
    `,
        accent: `
      bg-accent text-text hover:bg-accent-dark hover:text-white
      focus:ring-accent shadow-lg hover:shadow-xl
      hover:scale-[1.02] active:scale-[0.98]
    `,
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        xl: 'px-10 py-5 text-xl',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </button>
    );
};

export default Button;
