type ErrorMessageProps = {
    message: string;
    className?: string;
};

export default function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
    return (
        <div className={`p-4 rounded bg-red-50 border border-red-200 ${className}`}>
            <p className="text-red-800">
                Error: {message}
            </p>
        </div>
    );
}
