'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

type Auto = {
  id_auto: number;
  marca: string;
  modelo: string | null;
  anio: number | null;
};

export default function ComparePicker({ autos }: { autos: Auto[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>([]);

  // Máximo sugerido: 3
  const max = 3;

  const onToggle = (id: number) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= max) return prev; // no permitir más de 3
      return [...prev, id];
    });
  };

  const canCompare = selected.length >= 2; // mínimo 2 para comparar
  const query = useMemo(() => selected.join(','), [selected]);

  const goCompare = () => {
    if (!canCompare) return;
    router.push(`/comparar?ids=${query}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Seleccionados: <strong>{selected.length}</strong> / {max}
        </p>
        <button
          onClick={goCompare}
          disabled={!canCompare}
          className={`px-3 py-2 rounded text-white ${
            canCompare ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Comparar seleccionados
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {autos.map(a => {
          const checked = selected.includes(a.id_auto);
          const disabled = !checked && selected.length >= max; // deshabilitar extras al llegar a 3

          return (
            <label
              key={a.id_auto}
              className={`rounded-xl border p-4 shadow-sm cursor-pointer flex items-start gap-3 ${
                disabled ? 'opacity-60' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(a.id_auto)}
                className="mt-1"
              />
              <div>
                <div className="font-semibold">
                  {a.marca} {a.modelo ?? ''}
                </div>
                <div className="text-sm text-gray-600">({a.anio ?? '—'})</div>
                <div className="mt-2 text-xs text-gray-500">ID: {a.id_auto}</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
