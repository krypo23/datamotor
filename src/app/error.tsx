'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[60vh] grid place-items-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Ups, algo salió mal</h1>
        <p className="text-gray-600">Ocurrió un error inesperado. Puedes reintentar.</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Reintentar
        </button>
        <pre className="text-xs text-gray-400 mt-4">{error.message}</pre>
      </div>
    </main>
  );
}
