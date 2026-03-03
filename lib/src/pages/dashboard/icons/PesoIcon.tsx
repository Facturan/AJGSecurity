import { SVGProps } from "react";

export function PesoIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {/* Peso sign: P with two horizontal bars */}
            <path d="M6 20V4h6a4 4 0 0 1 0 8H6" />
            <line x1="4" y1="8" x2="14" y2="8" />
            <line x1="4" y1="12" x2="14" y2="12" />
        </svg>
    );
}
