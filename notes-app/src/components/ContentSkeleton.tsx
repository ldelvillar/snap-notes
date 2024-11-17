import { twMerge } from "tailwind-merge";

type ContentSkeletonProps = {
    title?: boolean;
    lines?: number;
    className?: string;
    titleWidth?: 'full' | '3/4' | '1/2';
    showImage?: boolean;
};

export default function ContentSkeleton({
    title = true,
    lines = 4,
    className = "",
    titleWidth = "3/4",
    showImage = false,
}: ContentSkeletonProps) {
    return (
        <div className={twMerge("space-y-4", className)}>
            {/* Optional image skeleton */}
            {showImage && (
                <div className="w-full h-48 bg-gray-200 animate-pulse rounded" />
            )}
            
            {/* Title skeleton */}
            {title && (
                <div 
                    className={`h-9 bg-gray-200 animate-pulse rounded w-${titleWidth}`}
                />
            )}
            
            {/* Content skeleton - multiple lines */}
            <div className="space-y-2">
                {Array.from({ length: lines }).map((_, index) => (
                    <div
                        key={index}
                        className={`h-4 bg-gray-200 animate-pulse rounded ${
                            index === lines - 1 ? 'w-2/3' : 'w-full'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
