import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/modules/interfaces";

const API_DOMAIN = "https://deisishop.pythonanywhere.com";

function toAbsoluteImageUrl(imagePath: string) {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  const normalized = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${API_DOMAIN}${normalized}`;
}

export default function ProdutoDetalhe({ produto }: { produto: Product }) {
  const imageUrl = toAbsoluteImageUrl(produto.image);

  const preco = Number(produto.price);
  const precoFormatado = Number.isFinite(preco)
    ? new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(preco)
    : "—";

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link
        href="/produtos"
        className="inline-flex items-center rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
      >
        ← Voltar aos produtos
      </Link>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4">
          <div className="relative h-80 w-full">
            <Image
              src={imageUrl}
              alt={produto.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">{produto.category}</p>
          <h1 className="mt-2 text-2xl font-bold">{produto.title}</h1>

          <p className="mt-4 text-lg font-semibold">{precoFormatado}</p>

          <div className="mt-4">
            <h2 className="text-sm font-semibold">Descrição</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              {produto.description}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold">Rating</h2>
            <p className="mt-2 text-sm text-gray-700">
              ⭐ {produto.rating.rate} ({produto.rating.count} avaliações)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
