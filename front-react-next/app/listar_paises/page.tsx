'use client';

import { useEffect, useState } from 'react';

type Pais = {
  id: number;
  nome: string;
  capital: string;
  tamanho: number;
  populacao: number;
  idioma: string;
};

type RespostaPaises = {
  detalhes?: Pais[];
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const numero = new Intl.NumberFormat('pt-BR');

export default function ListarPaises() {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function carregarPaises() {
      if (!apiUrl) {
        setErro('A URL da API não está configurada.');
        setCarregando(false);
        return;
      }

      try {
        const resposta = await fetch(`${apiUrl}/paises`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!resposta.ok) throw new Error('Não foi possível carregar os países.');

        const resultado: RespostaPaises = await resposta.json();
        setPaises(Array.isArray(resultado.detalhes) ? resultado.detalhes : []);
      } catch (causa) {
        if (causa instanceof Error && causa.name !== 'AbortError') {
          setErro(causa.message || 'Não foi possível conectar ao backend.');
        }
      } finally {
        setCarregando(false);
      }
    }

    void carregarPaises();
    return () => controller.abort();
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">Registros</p>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold text-slate-900">Países</h1>
        <p className="text-sm text-slate-600">
          {carregando ? 'Carregando...' : `${paises.length} ${paises.length === 1 ? 'país' : 'países'}`}
        </p>
      </div>

      {erro && <p role="alert" className="mb-5 text-red-700">{erro}</p>}
      {!carregando && !erro && paises.length === 0 && (
        <p className="border-y border-slate-200 py-6 text-slate-600">Nenhum país cadastrado ainda.</p>
      )}

      {paises.length > 0 && (
        <div className="overflow-x-auto border-y border-slate-200">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-100 text-sm text-slate-700">
                <th className="px-4 py-3 font-semibold">País</th>
                <th className="px-4 py-3 font-semibold">Capital</th>
                <th className="px-4 py-3 text-right font-semibold">Área (km²)</th>
                <th className="px-4 py-3 text-right font-semibold">População</th>
                <th className="px-4 py-3 font-semibold">Idioma</th>
              </tr>
            </thead>
            <tbody>
              {paises.map((pais) => (
                <tr key={pais.id} className="border-t border-slate-200 text-slate-800">
                  <td className="px-4 py-4 font-medium">{pais.nome}</td>
                  <td className="px-4 py-4">{pais.capital}</td>
                  <td className="px-4 py-4 text-right">{numero.format(pais.tamanho)}</td>
                  <td className="px-4 py-4 text-right">{numero.format(pais.populacao)}</td>
                  <td className="px-4 py-4">{pais.idioma}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}