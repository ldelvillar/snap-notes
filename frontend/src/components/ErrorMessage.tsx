type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      className="rounded border border-red-200 bg-red-50 p-4"
      role="alert"
      aria-live="assertive"
    >
      <p className="text-red-800">
        <span className="sr-only">Error:</span> {message}
      </p>
    </div>
  );
}
