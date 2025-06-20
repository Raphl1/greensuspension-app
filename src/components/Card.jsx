import React from 'react';

const Card = ({ icon, title, value, unit, children, className, valueHasGradient = false }) => (
  <div className={`bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 flex flex-col ${className}`}>
    <div className="flex items-center text-neutral-400 mb-2">
      {icon}
      <span className="ml-2 text-sm font-semibold">{title}</span>
    </div>
    {value && (
      <p className="text-3xl font-bold text-white">
        <span className={valueHasGradient ? 'accent-gradient' : ''}>{value}</span> <span className="text-xl font-medium text-neutral-400">{unit}</span>
      </p>
    )}
    {children}
  </div>
);

export default Card;
