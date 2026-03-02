
export interface User {
    id: string,
    name: string,
    email: string,
    senha: string,
    perfil: "USER" | "ADMIN",
    createdAt: string,
    updatedAte: string,

}

export interface UserAuth {
    id: string,
    nome: string
    email: string,
    perfil: "USER" | "ADMIN",
    token: string, // Token JWT retornado pela API para autenticação
}

export interface LoginResponse {
    session: UserAuth;
}