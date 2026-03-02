// Lê a URL base da API a partir das variáveis de ambiente do Next.js
// NEXT_PUBLIC_ permite que a variável seja usada no frontend
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

// Função utilitária que retorna a URL base da API
// Útil caso outros arquivos precisem dessa informação
export function getApiUrl() {
    return API_URL;
}

// Interface que estende RequestInit (interface padrão do fetch)
// Aqui você adiciona propriedades extras personalizadas
interface FethOptions extends RequestInit {

    // Token JWT opcional para autenticação
    token?: string;

    // Controle de cache do fetch (usado no Next.js App Router)
    // force-cache -> usa cache
    // no-store -> não usa cache (dados sempre atualizados)
    cache?: "force-cache" | "no-store";

    // Configurações específicas do Next.js para ISR e revalidação
    next?: {
        // false ou 0 -> não revalida
        // number -> revalida após X segundos
        revalidate?: false | 0 | number;

        // Tags usadas para revalidação por grupo
        tags?: string[];
    }
}

// Função genérica para chamadas HTTP
// <T> representa o tipo de dado que a API vai retornar
export async function apiClient<T>(
    endpoint: string,              // Endpoint da API (ex: "/users")
    options: FethOptions = {}       // Opções do fetch (opcional)
): Promise<T> {

    // Desestrutura o token das opções
    // Tudo que não for token fica em fetchOptions
    const { token, ...fetchOptions } = options;

    // Cria o objeto de headers
    // Se o usuário já passou headers, eles são reaproveitados
    const headers: Record<string, string> = {
        ...(fetchOptions.headers as Record<string, string>)
    };

    // Se o token existir, adiciona o header Authorization
    // Padrão usado para autenticação JWT
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // Verifica se o corpo da requisição NÃO é FormData
    // Se não for, assume que o envio será em JSON
    if (!(fetchOptions.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    // Executa a requisição HTTP usando fetch
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions, // method, body, cache, next, etc.
        headers,         // headers montados acima
    });

    // Verifica se a resposta NÃO está entre 200 e 299
    if (!response.ok) {

        // Tenta ler o erro retornado pela API em JSON
        // Se não conseguir, cria um erro padrão com o status HTTP
        const error = await response.json().catch(() => ({
            error: "Erro HTTP: " + response.status
        }));

        // Lança o erro para ser tratado no try/catch de quem chamou
        throw new Error(error.error || "Erro na requisição");
    }

    // Converte a resposta em JSON
    // O TypeScript entende que isso retorna um T
    return response.json();
}