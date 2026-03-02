import { cookies } from "next/headers";
import { apiClient } from "./api";
import { User } from "./types";
import { redirect } from "next/navigation";

const COOKIE_NAME = "token_pizzaria"; // Nome do cookie onde o JWT está armazenado

export async function getToken(): Promise<string | undefined> {   //lembrando que adicionar o Promoise<string | null> é opcional, pois a função já é async e o TypeScript infere isso automaticamente. Mas é uma boa prática para deixar claro o tipo de retorno da função.

    const cookieStore = await cookies(); // Cria uma instância do cookieStore para acessar os cookies
    return cookieStore.get(COOKIE_NAME)?.value // Obtém o valor do cookie "token" (JWT) se existir

};

export async function setToken(token: string) {

    const cookieStore = await cookies(); // Cria uma instância do cookieStore para acessar os cookies
    
    cookieStore.set(COOKIE_NAME, token, { // Define o cookie "token" com o valor do JWT
        httpOnly: true, // Torna o cookie acessível apenas pelo servidor (não pode ser acessado via JavaScript)
        secure: process.env.NODE_ENV === "production", // Define o cookie como seguro (apenas em HTTPS) em produção
        sameSite: true, // Define a política SameSite para proteger contra CSRF
        maxAge: 60 * 60 * 24 * 30, // Define a duração do cookie para 30 dias (em segundos)
        path: '/' // Define o caminho para o qual o cookie é válido (toda a aplicação)
    });

};

export async function removeToken() {
    const cookieStore = await cookies(); // Cria uma instância do cookieStore para acessar os cookies
    cookieStore.delete(COOKIE_NAME);    // Remove o cookie "token" para efetuar logout
};



export async function getUser(): Promise<User | null> {
    try {

        const token = await getToken(); // Obtém o token JWT do cookie  

        if (!token) {
            return null; // Se não houver token, retorna null (usuário não autenticado)
        };

        const user = await apiClient<User>("/me", { // Faz uma requisição para a rota "/me" da API para obter os dados do usuário autenticado
            token: token
        }
        );

        console.log("Usuário autenticado:", user); // Loga os dados do usuário autenticado para depuração
        
        return user;

    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function verificarAutenticacao(): Promise<User> {
    
    const user = await getUser();

    if (!user) {
        redirect("/login"); // Redireciona para a página de acesso negado se o usuário não estiver autenticado
    }

    return user; // Retorna os dados do usuário autenticado e autorizado (admin)

}   

export async function verificarAdmin(): Promise<User> {
    
    const user = await verificarAutenticacao();
    if (user.perfil !== "ADMIN") {
        redirect("/access-denied"); // Redireciona para a página de acesso negado se o usuário não for admin
    }

    return user; // Retorna os dados do usuário autenticado e autorizado (admin)

}   