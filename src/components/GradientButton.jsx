import React from 'react';

const GradientButton = ({ children, onClick, type = 'button' }) => (
    <button
        type={type}
        onClick={onClick}
        className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-emerald-500"
    >
        {children}
    </button>
);

export default GradientButton;