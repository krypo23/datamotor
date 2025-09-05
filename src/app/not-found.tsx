import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[60vh] grid place-items-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Página no encontrada</h1>
        <p className="text-gray-600">
          La ruta que intentas abrir no existe. ¿Volvemos al catálogo?
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Ir al inicio
          </Link>
          <Link
            href="/comparar?ids=1,2,3"
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            Ver comparador (demo)
          </Link>
        </div>
      </div>
    </main>
  );
}
