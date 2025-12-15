"use client";

import React, { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import type { Product } from "@/modules/interfaces";
import ProdutoCard from "@/components/Loja/ProdutoCard";

const CART_KEY = "cart";

type BuyResponse = {
  totalCost?: string;
  reference?: string;
  message?: string;
  error?: string;
};

type PurchaseSummary = {
  items: Product[];
  response: BuyResponse;
  student: boolean;
  coupon: string;
};

const fetcher = async (url: string): Promise<Product[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ao carregar produtos (${res.status})`);
  return res.json();
};

export default function ProdutosPage() {
  const { data, error, isLoading } = useSWR<Product[]>(
    "https://deisishop.pythonanywhere.com/products",
    fetcher
  );

  // filtros/ordenacao
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [filteredData, setFilteredData] = useState<Product[]>([]);

  // carrinho
  const [cart, setCart] = useState<Product[]>([]);

  // compra
  const [student, setStudent] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [buyLoading, setBuyLoading] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  // ✅ estado único do resumo de compra
  const [purchaseSummary, setPurchaseSummary] =
    useState<PurchaseSummary | null>(null);

  // carregar carrinho
  useEffect(() => {
    const saved = localStorage.getItem(CART_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setCart(parsed);
    } catch {}
  }, []);

  // guardar carrinho
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // ✅ sempre que o carrinho volta a ter itens, esconder “Compra efetuada”
  useEffect(() => {
    if (purchaseSummary && cart.length > 0) {
      setPurchaseSummary(null);
    }
  }, [cart.length, purchaseSummary]);

  // filtrar + ordenar
  useEffect(() => {
    if (!data) return;

    let resultado = [...data];

    if (search) {
      const termo = search.toLowerCase();
      resultado = resultado.filter((p) =>
        p.title.toLowerCase().includes(termo)
      );
    }

    switch (sortOption) {
      case "name-asc":
        resultado.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        resultado.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price-asc":
        resultado.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        resultado.sort((a, b) => Number(b.price) - Number(a.price));
        break;
    }

    setFilteredData(resultado);
  }, [search, sortOption, data]);

  // add/remove carrinho
  const addToCart = (produto: Product) => {
    setCart((prev) => [...prev, produto]);
    setBuyError(null);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index === -1) return prev;
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    setBuyError(null);
  };

  // total carrinho
  const total = useMemo(
    () => cart.reduce((acc, p) => acc + (Number(p.price) || 0), 0),
    [cart]
  );

  const totalFormatado = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(total);

  // comprar
  const buy = async () => {
    try {
      setBuyLoading(true);
      setBuyError(null);

      if (cart.length === 0) {
        setBuyError("O carrinho está vazio.");
        return;
      }

      const response = await fetch("https://deisishop.pythonanywhere.com/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: cart.map((p) => p.id),
          student: student,
          coupon: coupon.trim(),
          name: "",
        }),
      });

      const data: BuyResponse = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Erro ao comprar");
      }

      // ✅ guardar o que comprou + desconto + resposta
      setPurchaseSummary({
        items: cart,
        response: data,
        student,
        coupon: coupon.trim(),
      });

      // limpar carrinho
      setCart([]);
    } catch (e: any) {
      setBuyError(e?.message ?? "Erro ao comprar");
    } finally {
      setBuyLoading(false);
    }
  };

  if (isLoading) return <div className="spinner" />;

  if (error) {
    return (
      <p className="mx-auto mt-8 max-w-xl rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
        {error.message}
      </p>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-6 rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Produtos</h1>
              <p className="mt-1 text-sm text-slate-600">
                A mostrar {filteredData.length} produto(s)
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
              <input
                type="text"
                placeholder="Pesquisar por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-200 sm:w-72"
              />

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-200 sm:w-52"
              >
                <option value="name-asc">Nome (A–Z)</option>
                <option value="name-desc">Nome (Z–A)</option>
                <option value="price-asc">Preço (crescente)</option>
                <option value="price-desc">Preço (decrescente)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Lista */}
          <section className="order-2 lg:order-1 lg:col-span-8 xl:col-span-9">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {filteredData.map((p) => (
                <ProdutoCard
                  key={p.id}
                  produto={p}
                  showAddButton
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </section>

          {/* Carrinho + Checkout */}
          <aside className="order-1 lg:order-2 lg:col-span-4 xl:col-span-3">
            <div className="rounded-2xl border bg-white p-5 shadow-sm lg:sticky lg:top-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Carrinho</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                  {cart.length} item(s)
                </span>
              </div>

              <div className="mt-4 space-y-3 max-h-[360px] overflow-auto lg:max-h-none">
                {cart.length === 0 ? (
                  <p className="text-sm text-slate-600">
                    Ainda não adicionaste produtos.
                  </p>
                ) : (
                  cart.map((p, index) => (
                    <ProdutoCard
                      key={`${p.id}-${index}`}
                      produto={p}
                      showRemoveButton
                      onRemoveFromCart={removeFromCart}
                    />
                  ))
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-base font-bold">{totalFormatado}</span>
              </div>

              {/* Inputs da compra */}
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={student}
                    onChange={(e) => setStudent(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Estudante DEISI
                </label>

                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Cupão de desconto"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                />

                <button
                  type="button"
                  onClick={buy}
                  disabled={buyLoading || cart.length === 0}
                  className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {buyLoading ? "A comprar..." : "Comprar"}
                </button>

                {/* erro */}
                {buyError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {buyError}
                  </div>
                )}

                {/* ✅ resumo da compra (desaparece quando adicionas ao carrinho) */}
                {purchaseSummary && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                    <p className="font-semibold">Compra efetuada ✅</p>

                    <div className="mt-2 space-y-1">
                      {Object.values(
                        purchaseSummary.items.reduce((acc: any, p) => {
                          acc[p.id] ??= { ...p, qty: 0 };
                          acc[p.id].qty += 1;
                          return acc;
                        }, {})
                      ).map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="truncate">
                            {item.title}{" "}
                            <span className="text-emerald-800/70">
                              x{item.qty}
                            </span>
                          </span>

                          <span className="font-medium">
                            {new Intl.NumberFormat("pt-PT", {
                              style: "currency",
                              currency: "EUR",
                            }).format((Number(item.price) || 0) * item.qty)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 border-t border-emerald-200 pt-3">
                      <p>
                        Desconto aplicado:{" "}
                        <span className="font-semibold">
                          {purchaseSummary.student || purchaseSummary.coupon
                            ? "Sim"
                            : "Não"}
                        </span>
                      </p>

                      {purchaseSummary.student && (
                        <p className="text-emerald-900/80">
                          • Estudante DEISI: Sim
                        </p>
                      )}

                      {!!purchaseSummary.coupon && (
                        <p className="text-emerald-900/80">
                          • Cupão: {purchaseSummary.coupon}
                        </p>
                      )}

                      <div className="mt-2">
                        <p>
                          <span className="font-semibold">Total (API):</span>{" "}
                          {purchaseSummary.response.totalCost}
                        </p>
                        <p>
                          <span className="font-semibold">Referência:</span>{" "}
                          {purchaseSummary.response.reference}
                        </p>
                        <p>
                          <span className="font-semibold">Mensagem:</span>{" "}
                          {purchaseSummary.response.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
