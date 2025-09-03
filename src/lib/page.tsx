import { supabase } from '@/lib/supabase';

type Auto = {
  id_auto: number;
  marca: string;
  modelo: string | null;
  modelo_version: string | null;
  año: number | null;
};

async function obtenerAutos(ids: string[]): Promise<Auto[]> {
  const { data, error } = await supabase
    .from('autos')
    .select('id_auto, marca, modelo, modelo_version, año')
    .in('id_auto', ids.map(id => parseInt(id)));

  if (error) {
    console.error("Error al obtener autos:", error);
    return [];
  }

  return data as Auto[];
}

export default async function CompararPage({
  searchParams,
}: {
  searchParams: { ids?: string };
}) {
  // 1. Capturar IDs desde la URL (?ids=1,2,3)
  const ids = searchParams.ids?.split(',').map(id => id.trim()) ?? [];

  if (ids.length === 0) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Comparador de Autos</h1>
        <p className="text-gray-600">
          Selecciona autos para comparar usando la URL, ejemplo:
          <br />
          <code>?ids=1,2,3</code>
        </p>
      </main>
    );
  }

  // 2. Obtener datos desde Supabase
  const autos = await obtenerAutos(ids);

  if (!autos || autos.length === 0) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Comparador de Autos</h1>
        <p className="text-red-600">No se encontraron autos con esos IDs.</p>
      </main>
    );
  }

  // 3. Renderizar tabla comparativa
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Comparador de Autos</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border p-2 text-left bg-gray-100">Campo</th>
              {autos.map(auto => (
                <th key={auto.id_auto} className="border p-2 bg-gray-50">
                  {auto.marca} {auto.modelo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 font-medium">Versión</td>
              {autos.map(auto => (
                <td key={auto.id_auto} className="border p-2">
                  {auto.modelo_version ?? '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-2 font-medium">Año</td>
              {autos.map(auto => (
                <td key={auto.id_auto} className="border p-2">
                  {auto.año ?? '—'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
