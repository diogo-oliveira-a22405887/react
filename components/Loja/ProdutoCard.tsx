"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/modules/interfaces";

const API_DOMAIN = "https://deisishop.pythonanywhere.com";

function toAbsoluteImageUrl(imagePath: string) {
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const normalized = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${API_DOMAIN}${normalized}`;
}

type ProdutoCardProps = {
  produto: Product;
  onAddToCart?: (produto: Product) => void;
  onRemoveFromCart?: (id: number) => void;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
};

export default function ProdutoCard({
  produto,
  onAddToCart,
  onRemoveFromCart,
  showAddButton = false,
  showRemoveButton = false,
}: ProdutoCardProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [precoFormatado, setPrecoFormatado] = useState("—");

  useEffect(() => {
    setImageUrl(toAbsoluteImageUrl(produto.image));

    const preco = Number(produto.price);
    const formatado = Number.isFinite(preco)
      ? new Intl.NumberFormat("pt-PT", {
          style: "currency",
          currency: "EUR",
        }).format(preco)
      : "—";

    setPrecoFormatado(formatado);
  }, [produto]);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Conteúdo clicável */}
      <div className="flex-1">
        <Link href={`/produtos/${produto.id}`} className="block">
          <div className="relative mb-3 h-44 w-full">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={produto.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            )}
          </div>

          <p className="mb-1 text-xs text-muted-foreground">{produto.category}</p>

          <h3 className="line-clamp-2 text-sm font-semibold">{produto.title}</h3>
        </Link>
      </div>

      {/* Rodapé fixo */}
      <div className="mt-4 border-t pt-3">
        <p className="mb-3 text-sm font-bold">{precoFormatado}</p>

        <div className="flex flex-col gap-2">
          {/* +info (Link independente) */}
          <Link
            href={`/produtos/${produto.id}`}
            className="w-full rounded-xl bg-blue-600 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-blue-700"
          >
            +info
          </Link>

          {showAddButton && (
            <button
              type="button"
              onClick={() => onAddToCart?.(produto)}
              className="w-full rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Adicionar
            </button>
          )}

          {showRemoveButton && (
            <button
              type="button"
              onClick={() => onRemoveFromCart?.(produto.id)}
              className="w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
            >
              Remover
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
