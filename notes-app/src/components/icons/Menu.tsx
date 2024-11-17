import React from 'react';
import type { SVGProps } from 'react';

export default function MenuIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            {...props}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                />
        </svg>
    );
}
