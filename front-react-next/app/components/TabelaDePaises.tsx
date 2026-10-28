
export default async function Retornar_Paises() {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;


    let logs = "Página iniciada, buscando dados de: " + apiUrl + "/paises";

    const response = await fetch(apiUrl + "/paises", {
        cache: "no-store"
    });

    logs = logs + "; API disparada;";

    let lines = [];

    if (!response.ok) {

        logs = logs + " Erro ao buscar países, response.ok = false";

    } else {

        const data = await response.json();


        logs =
            logs +
            "; respostas obtidas, resultado = " +
            data?.resultado;

        lines = Array.isArray(data?.detalhes)
            ? data.detalhes
            : [];

        logs =
            logs +
            "; linhas obtidas = " +
            lines.length;
    }

    return (
        <>

            {logs && (
                <p className="text-green-600 font-medium">
                    {logs}
                </p>
            )}

            <ul className="mt-6 w-full divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white shadow-md">


                {lines.map(
                    (line: {
                        id: number;
                        nome: string;
                        capital: string;
                        continente: string;
                        populacao: number;
                        area: number;
                    }) => (
                        <li
                            key={line.id}
                            className="px-6 py-4 text-lg text-gray-800 transition-colors hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                        >
                            <strong>{line.id}. {line.nome}</strong>
                            <br />
                            Capital: {line.capital}
                            <br />
                            Continente: {line.continente}
                            <br />
                            População: {line.populacao.toLocaleString('pt-BR')} habitantes
                            <br />
                            Área: {line.area.toLocaleString('pt-BR')} km²
                        </li>
                    )
                )}

            </ul>
        </>
    );
}
