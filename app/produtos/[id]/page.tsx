"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Product } from "@/modules/interfaces";
import ProdutoDetalhe from "@/components/Loja/ProdutoDetalhe";

export default function ProdutoPage() {
  const { id } = useParams<{ id: string }>();

  const [produto, setProduto] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function carregarProduto() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://deisishop.pythonanywhere.com/products/${id}`
        );

        if (!res.ok) {
          throw new Error(`Erro ao carregar produto (${res.status})`);
        }

        const data: Product = await res.json();
        setProduto(data);
      } catch (e: any) {
        setError(e.message ?? "Erro inesperado");
      } finally {
        setLoading(false);
      }
    }

    carregarProduto();
  }, [id]);

  if (loading) return <div className="spinner" />;

  if (error) {
    return (
      <p className="mx-auto mt-8 max-w-xl rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (!produto) return null;

  return <ProdutoDetalhe produto={produto} />;
}
