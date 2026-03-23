type ContentSkeletonProps = {
  title?: boolean;
  lines?: number;
  titleWidth?: 'full' | '3/4' | '1/2';
  showImage?: boolean;
};

export default function ContentSkeleton({
  title = true,
  lines = 4,
  titleWidth = '3/4',
  showImage = false,
}: ContentSkeletonProps) {
  return (
    <div className="mx-10 mt-12 md:mx-20">
      <div className="mx-auto min-h-[80vh] max-w-xl space-y-4 pt-20">
        {/* Optional image skeleton */}
        {showImage && (
          <div className="h-48 w-full animate-pulse rounded bg-gray-200" />
        )}

        {/* Title skeleton */}
        {title && (
          <div
            className={`h-9 animate-pulse rounded bg-gray-200 w-${titleWidth}`}
          />
        )}

        {/* Content skeleton - multiple lines */}
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`h-4 animate-pulse rounded bg-gray-200 ${
                index === lines - 1 ? 'w-2/3' : 'w-full'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
