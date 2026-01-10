import React from 'react';

const Card = ({
    children,
    className = '',
    hover = true,
    glass = false,
    padding = 'md',
    ...props
}) => {
    const baseStyles = `
    rounded-2xl transition-all duration-300 ease-out
  `;

    const hoverStyles = hover ? `
    hover:shadow-hover hover:-translate-y-1
  ` : '';

    const glassStyles = glass ? `
    glass-card
  ` : `
    bg-surface shadow-card border border-gray-100
  `;

    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
    };

    return (
        <div
            className={`${baseStyles} ${hoverStyles} ${glassStyles} ${paddings[padding]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
