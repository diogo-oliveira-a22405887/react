import Link from "next/link";

interface CaracteristicaProps {
  caracteristica: string;
}

export default function Caracteristica({ caracteristica }: CaracteristicaProps) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2">
      <h3 className="text-lg font-semibold">{caracteristica}</h3>

      <Link
        href={`/caracteristicas/${encodeURIComponent(caracteristica)}`}
        className="text-blue-600 underline text-sm"
      >
        Ver detalhes
      </Link>
    </div>
  );
}
