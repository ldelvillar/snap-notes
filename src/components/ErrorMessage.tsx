type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      className="p-4 rounded bg-red-50 border border-red-200"
      role="alert"
      aria-live="assertive"
    >
      <p className="text-red-800">
        <span className="sr-only">Error:</span> {message}
      </p>
    </div>
  );
}
