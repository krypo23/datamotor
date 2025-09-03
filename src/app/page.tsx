import { supabase } from '@/lib/supabase';
import ComparePicker from '@/components/ComparePicker';

type Auto = {
  id_auto: number;
  marca: string;
  modelo: string | null;
  anio: number | null; // si en DB es "año", aliaséalo en el select
};

export default async function Home() {
  const { data, error } = await supabase
    .from('autos')
    .select('id_auto, marca, modelo, anio') // si tu columna es "año", usa: 'id_auto, marca, modelo, anio:año'
    .order('id_auto', { ascending: true })
    .limit(60);

  if (error) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-3xl font-bold mb-4">DataMotor — Catálogo</h1>
        <p className="text-red-600">Error: {error.message}</p>
      </main>
    );
  }

  const autos = (data ?? []) as Auto[];

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold mb-4">DataMotor — Catálogo</h1>
      <p className="mb-4 text-gray-700">
        Marca 2 o 3 autos y presiona <em>Comparar seleccionados</em>.
      </p>

      <ComparePicker autos={autos} />
    </main>
  );
}

