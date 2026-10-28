
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FormIncluirPais() {
  const [nome, setNome] = useState('');
  const [capital, setCapital] = useState('');
  const [continente, setContinente] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [area, setArea] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const savedToken = localStorage.getItem('token');

    if (!savedToken) {
      router.replace('/form_login');
      return;
    }

    setToken(savedToken);
  }, [router]);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => setError(''), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    try {
      const resposta = await fetch(`${apiUrl}/pais`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          capital,
          continente,
          populacao: Number(populacao),
          area: Number(area),
        }),
      });

      switch (resposta.status) {
        case 200:
        case 201:
          setMessage('País cadastrado com sucesso!');
          setNome('');
          setCapital('');
          setContinente('');
          setPopulacao('');
          setArea('');
          break;

        case 400:
          setError('Dados inválidos. Verifique os campos obrigatórios.');
          break;

        case 401:
          setError('A sessão expirou. Faça login novamente.');
          localStorage.removeItem('token');
          router.replace('/form_login');
          break;

        case 403:
          setError('Você não tem permissão para realizar esta ação.');
          break;

        case 500:
          setError('Erro interno no servidor backend.');
          break;

        default:
          setError(`Não foi possível cadastrar o país. Código: ${resposta.status}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar país:', error);
      setError('Não foi possível conectar-se ao backend.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          Cadastrar País
        </h1>

        {message && (
          <p className="text-green-600 font-medium mb-4">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-600 font-medium mb-4">
            {error}
          </p>
        )}

        <form className="flex flex-col gap-4 w-full" onSubmit={enviar}>

          <input
            type="text"
            name="nome"
            placeholder="Nome do país"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />

          <input
            type="text"
            name="capital"
            placeholder="Capital"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />

          <select
            name="continente"
            value={continente}
            onChange={(e) => setContinente(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 text-black"
            required
          >
            <option value="">Selecione o continente</option>
            <option value="África">África</option>
            <option value="América do Norte">América do Norte</option>
            <option value="América do Sul">América do Sul</option>
            <option value="Ásia">Ásia</option>
            <option value="Europa">Europa</option>
            <option value="Oceania">Oceania</option>
            <option value="Antártida">Antártida</option>
          </select>

          <input
            type="number"
            name="populacao"
            placeholder="População (habitantes)"
            value={populacao}
            onChange={(e) => setPopulacao(e.target.value)}
            min="1"
            step="1"
            className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />

          <input
            type="number"
            name="area"
            placeholder="Área territorial (km²)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            min="0.01"
            step="any"
            className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer bg-blue-600 text-white px-4 py-3 rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar país'}
          </button>

        </form>
      </main>
    </div>
  );
}
