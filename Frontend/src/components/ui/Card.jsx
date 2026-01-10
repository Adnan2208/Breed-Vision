import React from 'react';

const Card = ({
  children,
  className = '',
  hover = true,
  glass = false,
  premium = false,
  padding = 'md',
  ...props
}) => {
  // Premium card: Glass + Lift + Glow system
  const premiumStyles = premium ? `
    card-premium
  ` : '';

  // Standard glass card
  const glassStyles = glass && !premium ? `
    glass-card
  ` : '';

  // Default solid card with hover-lift
  const defaultStyles = !glass && !premium ? `
    bg-surface border border-gray-100/60 rounded-2xl
    transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
    ${hover ? 'hover:shadow-hover hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1),0_0_30px_rgba(15,118,110,0.12)]' : 'shadow-card'}
  ` : '';

  // Base styles for all cards
  const baseStyles = premium || glass ? '' : `rounded-2xl`;

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  return (
    <div
      className={`
        ${baseStyles}
        ${premiumStyles}
        ${glassStyles}
        ${defaultStyles}
        ${paddings[padding]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
