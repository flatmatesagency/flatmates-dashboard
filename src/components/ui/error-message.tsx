interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="text-red-500">{message}</div>
    </div>
  );
} 