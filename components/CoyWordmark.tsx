'use client';

import React from 'react';

interface CoyWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  textColor?: string;
}

export const CoyWordmark: React.FC<CoyWordmarkProps> = ({
  className = '',
  size = 'md',
  textColor = 'text-[#15121d]'
}) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-6xl md:text-7xl'
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4 md:w-5 md:h-5'
  };

  return (
    <span
      className={`inline-flex items-baseline font-[800] tracking-[-0.04em] lowercase select-none ${sizeClasses[size]} ${textColor} ${className}`}
      style={{ fontFamily: 'var(--font-bricolage), "Bricolage Grotesque", system-ui, sans-serif' }}
    >
      coy
      <span
        className={`inline-block rounded-full ml-1 shrink-0 ${dotSizes[size]}`}
        style={{ backgroundColor: '#ff3d81' }}
      />
    </span>
  );
};
