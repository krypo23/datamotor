import { supabase } from '@/lib/supabase';

type Auto = {
  id_auto: number;
  marca: string;
  modelo: string | null;
  modelo_version: string | null;
  anio: number | null;
};

function parseIds(raw?: string): number[] {
  if (!raw) return [];
  const ids = raw
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => Number.isFinite(n));
  // quita duplicados manteniendo orden
  return [...new Set(ids)];
}

async function fetchAutos(ids: number[]) {
  const { data, error } = await supabase
    .from('autos')
    .select('id_auto, marca, modelo, modelo_version, anio') // si tu columna es "año", usa anio:año
    .in('id_auto', ids);

  if (error) throw error;
  return (data ?? []) as Auto[];
}

export default async function CompararPage({
  searchParams,
}: {
  searchParams: { ids?: string };
}) {
  const ids = parseIds(searchParams.ids);

  if (ids.length === 0) {
    return (
      <main className="p-6 space-y-3">
        <h1 className="text-2xl font-bold">Comparador de Autos</h1>
        <p className="text-gray-700">
          Agrega IDs en la URL para comparar. Ejemplo:{' '}
          <code className="bg-gray-100 px-1 rounded">/comparar?ids=1,2,3</code>
        </p>
      </main>
    );
  }

  let autos: Auto[] = [];
  try {
    autos = await fetchAutos(ids);
  } catch (e: any) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Comparador de Autos</h1>
        <p className="text-red-600">Error al obtener datos: {e.message}</p>
      </main>
    );
  }

  if (!autos.length) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Comparador de Autos</h1>
        <p className="text-red-600">No se encontraron autos con esos IDs.</p>
      </main>
    );
  }

  const filas = [
    { label: 'Marca', key: 'marca' as const },
    { label: 'Modelo', key: 'modelo' as const },
    { label: 'Versión', key: 'modelo_version' as const },
    { label: 'Año', key: 'anio' as const },
  ];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Comparador de Autos</h1>

      <div className="mb-3 text-sm text-gray-600">
        Comparando IDs:{' '}
        <code className="bg-gray-100 px-1 rounded">{ids.join(', ')}</code>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-2 text-left">Campo</th>
              {autos.map(a => (
                <th key={a.id_auto} className="border p-2 text-left">
                  {a.marca} {a.modelo ?? ''} ({a.anio ?? '—'})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map(fila => (
              <tr key={fila.key}>
                <td className="border p-2 font-medium">{fila.label}</td>
                {autos.map(a => (
                  <td key={`${fila.key}-${a.id_auto}`} className="border p-2">
                    {/* @ts-expect-error index access */}
                    {a[fila.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
