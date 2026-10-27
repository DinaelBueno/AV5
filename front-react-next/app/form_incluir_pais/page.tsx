'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type DadosPais = {
  nome: string;
  capital: string;
  tamanho: string;
  populacao: string;
  idioma: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function FormIncluirPais() {
  const [dados, setDados] = useState<DadosPais>({
    nome: '',
    capital: '',
    tamanho: '',
    populacao: '',
    idioma: '',
  });
  const [token, setToken] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token');
    if (!tokenSalvo) {
      router.replace('/form_login');
      return;
    }
    setToken(tokenSalvo);
  }, [router]);

  function atualizarCampo(campo: keyof DadosPais, valor: string) {
    setDados((atuais) => ({ ...atuais, [campo]: valor }));
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensagem('');
    setErro('');

    if (!apiUrl) {
      setErro('A URL da API não está configurada.');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await fetch(`${apiUrl}/pais`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: dados.nome.trim(),
          capital: dados.capital.trim(),
          tamanho: Number(dados.tamanho),
          populacao: Number(dados.populacao),
          idioma: dados.idioma.trim(),
        }),
      });
      const resultado = await resposta.json();

      if (!resposta.ok) {
        setErro(resultado.detalhes || 'Não foi possível cadastrar o país.');
        return;
      }

      setMensagem('País cadastrado com sucesso.');
      setDados({ nome: '', capital: '', tamanho: '', populacao: '', idioma: '' });
    } catch {
      setErro('Não foi possível conectar ao backend.');
    } finally {
      setCarregando(false);
    }
  }

  if (!token) return null;

  const campos: { chave: keyof DadosPais; rotulo: string; tipo: string }[] = [
    { chave: 'nome', rotulo: 'País', tipo: 'text' },
    { chave: 'capital', rotulo: 'Capital', tipo: 'text' },
    { chave: 'tamanho', rotulo: 'Área em km²', tipo: 'number' },
    { chave: 'populacao', rotulo: 'População', tipo: 'number' },
    { chave: 'idioma', rotulo: 'Idioma oficial', tipo: 'text' },
  ];

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-10">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">Cadastro</p>
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Novo país</h1>

      {mensagem && <p role="status" className="mb-5 text-green-700">{mensagem}</p>}
      {erro && <p role="alert" className="mb-5 text-red-700">{erro}</p>}

      <form className="flex flex-col gap-5" onSubmit={enviar}>
        {campos.map(({ chave, rotulo, tipo }) => (
          <label key={chave} className="flex flex-col gap-2 font-medium text-slate-800">
            {rotulo}
            <input
              type={tipo}
              min={tipo === 'number' ? 1 : undefined}
              step={tipo === 'number' ? 1 : undefined}
              value={dados[chave]}
              onChange={(evento) => atualizarCampo(chave, evento.target.value)}
              required
              className="rounded border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        ))}

        <button
          type="submit"
          disabled={carregando}
          className="mt-2 w-fit rounded bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {carregando ? 'Cadastrando...' : 'Cadastrar país'}
        </button>
      </form>
    </main>
  );
}