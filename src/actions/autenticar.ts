"use server"; // Indica que este arquivo será executado no servidor (Server Action do Next.js)

import { apiClient } from "@/lib/api"; // Importa o cliente HTTP responsável por comunicar com a API backend
import { removeToken, setToken } from "@/lib/auth";
import { LoginResponse, User } from "@/lib/types";  //Pega o TYPE User que eu criei atraves de Interface 
import { redirect } from "next/navigation"; // Importa a função de redirecionamento do Next.js para navegação entre páginas

export async function registerAction(
    prevState: { success: boolean; error: string, redirectTo?: string } | null, // Estado anterior controlado pelo useActionState
    formData: FormData // Objeto que contém os dados enviados pelo formulário
) {

    try {
        const nome = formData.get("name") as string; // Obtém o valor do input name="name" enviado pelo formulário
        const email = formData.get("email") as string; // Obtém o valor do input name="email"
        const senha = formData.get("password") as string; // Obtém o valor do input name="password"

        const data = { // Cria o objeto com os dados no formato esperado pela API
            nome: nome, // Nome do usuário conforme o backend espera
            email: email, // Email do usuário
            senha: senha // Senha do usuário
        }

        const user = await apiClient<User>("/users", { // Envia uma requisição POST para o endpoint /users da API   //Como apiCliente era do tipo <T> generico, agora eu tipei coomo User.
            method: "POST", // Define o método HTTP como POST
            body: JSON.stringify(data) // Converte o objeto de dados em JSON para envio
        });

        return { success: true, error: "", redirectTo: "/login" } // Retorna sucesso e informa para redirecionar para a página de login

    } catch (error) { // Captura qualquer erro ocorrido durante a execução
        if (error instanceof Error) { // Verifica se o erro é uma instância da classe Error
            return { success: false, error: error.message } // Retorna a mensagem de erro para o frontend
        }

        return { success: false, error: "Error ao criar conta" } // Retorno padrão para erros inesperados
    }
};

export async function loginAction(
    prevState: { success: boolean; error: string, redirectTo?: string } | null, // Estado anterior controlado pelo useActionState
    formData: FormData // Objeto que contém os dados enviados pelo formulário) {
) {
    try {
        const email = formData.get("email") as string; // Obtém o valor do input name="email"
        const senha = formData.get("password") as string; // Obtém o valor do input name="password"

        const data = {
            email: email,
            senha: senha
        };

        const response = await apiClient<LoginResponse>("/login", {
            method: "POST",
            body: JSON.stringify(data)
        });

        //Funcao esta em lib auth.ts, responsavel por armazenar o token JWT retornado pela API no cookie para autenticação futura
        await setToken(response.session.token);

        return { success: true, error: "", redirectTo: "/dashboard" }; // Retorna sucesso e informa para redirecionar para a página de dashboardF

    } catch (error) {

        console.log(error); // Log para verificar o erro ocorrido durante a execução

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message || "Error ao fazer login"
            }; // Retorna a mensagem de erro para o frontend
        }

        return { success: false, error: "Error ao fazer login" }; // Retorno padrão para erros inesperados

    }

};

export async function logoutAction() {
    await removeToken(); // Limpa o token JWT do cookie para efetuar logout
    redirect("/login"); // Redireciona para a página de login após o logout
};