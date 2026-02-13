import React from "react";

function Button({ children, variant = 'primary', className = '', ...props }) {
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl',
        secondary: 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
        ghost: 'text-gray-700 hover:bg-gray-100',
    }

    return (
        <button
            className={`px-6 py-3 cursor-pointer rounded-lg font-semibold transition-all duration-200 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

function Card({ children, className = '' }) {
    return (
        <div className={`bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 ${className}`}>
            {children}
        </div>
    )
}

export { Button, Card };
