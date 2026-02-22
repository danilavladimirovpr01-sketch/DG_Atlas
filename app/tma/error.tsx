'use client';

export default function TmaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-sm w-full space-y-4 text-center">
        <h2 className="text-xl font-bold text-red-400">Ошибка</h2>
        <p className="text-zinc-400 text-sm break-all">
          {error.message}
        </p>
        <pre className="text-xs text-zinc-600 text-left overflow-auto max-h-48 bg-zinc-900 p-3 rounded-lg">
          {error.stack}
        </pre>
        <button
          onClick={reset}
          className="px-6 py-3 bg-white text-black rounded-lg font-medium"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
