import Image from "next/image";
import tecnologiasJson from "@/data/tecnologias.json";

interface Tecnologia {
  title: string;
  image: string;
  description: string;
  rating: number;
};

const tecnologias: Tecnologia[] = JSON.parse(JSON.stringify(tecnologiasJson));

export default function TecnologiasPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Tecnologias</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {tecnologias.map((tec, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-4 flex flex-col items-center gap-3"
          >
            <Image
              src={`/tecnologias/${tec.image}`}
              alt={`Logotipo de ${tec.title}`}
              width={200}
              height={200}
            />

            <h3 className="text-lg font-semibold">{tec.title}</h3>

            <p className="text-sm text-gray-700 text-center">
              {tec.description}
            </p>

            <p className="text-yellow-500 font-semibold">
              {"★".repeat(tec.rating)}{" "}
              <span className="text-gray-500 text-xs">
                ({tec.rating}/5)
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
