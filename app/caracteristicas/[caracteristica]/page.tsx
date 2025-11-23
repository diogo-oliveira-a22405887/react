import Link from "next/link";

interface CaracteristicaPageProps {
  params: {
    caracteristica: string;
  };
}

export default function CaracteristicaPage({ params }: CaracteristicaPageProps) {
  const caracteristica = params.caracteristica; // sem decode por agora

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center gap-4 w-80">
        <h1 className="text-2xl font-bold text-center">{caracteristica}</h1>

        <p className="text-gray-600 text-center">
          Detalhes sobre <strong>{caracteristica}</strong>
        </p>

        <Link
          href="/caracteristicas"
          className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Voltar
        </Link>
      </div>
    </div>
  );
}
