"use client";
// Indica que este componente roda no CLIENTE.
// Necessário porque usamos hooks do React (useActionState, useEffect, useRouter)

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

// Hooks do React
import { useActionState, useEffect } from "react";

// Server Action responsável por processar o cadastro
import { registerAction } from "@/actions/autenticar";

// Hook de navegação do Next.js (App Router)
import { useRouter } from "next/navigation";

export function RegisterForm() {

    /**
     * useActionState é um hook do React/Next que conecta um formulário
     * diretamente a uma Server Action.
     *
     * Ele retorna:
     * - state: estado retornado pela Server Action (success, error, redirectTo, etc.)
     * - formAction: função que deve ser passada para o atributo action do <form>
     * - isPending: boolean que indica se a submissão está em andamento
     */
    const [state, formAction, isPending] = useActionState(registerAction, null);

    /**
     * useRouter permite fazer navegação programática
     * (redirect, replace, push) no App Router do Next.js
     */
    const router = useRouter();

    /**
     * useEffect é usado para "escutar" mudanças no state retornado
     * pela Server Action.
     *
     * Quando:
     * - state.success === true
     * - e existir state.redirectTo
     *
     * O usuário é redirecionado automaticamente para a rota informada.
     *
     * Exemplo:
     * state = { success: true, redirectTo: "/login" }
     */
    useEffect(() => {
        if (state?.success && state?.redirectTo) {
            // replace substitui a rota atual (não permite voltar com o botão "voltar")
            router.replace(state.redirectTo);
        }
    }, [state, router]);

    return (

        <Card className="bg-app-card border border-app-border w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-center text-white text-3xl sm:text-4xl font-bold">The Jacks  <span className="text-brand-primary">Pizzarias</span></CardTitle>
                <CardDescription className="text-center text-white">Cadastre-se para continuar</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" action={formAction}> 
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Nome</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Digite seu nome"
                            required
                            minLength={3}
                            maxLength={255}
                            className="text-white bg-app-background bg-app-card"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">E-mail</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Digite seu email"
                            required
                            minLength={3}
                            maxLength={255}
                            className="text-white bg-app-background bg-app-card"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="senha" className="text-white">Senha</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Digite sua senha"
                            required
                            minLength={3}
                            maxLength={255}
                            className="text-white bg-app-background bg-app-card"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-brand-primary text-white hover:bg-brand-primary/90"> {isPending ? "Criando conta...": "Cadastrar"}

                    </Button>


                    <p className="text-center text-white">
                        Já tem uma conta? <Link href="/login" className="text-brand-primary hover:underline font-bold">Faça login</Link>
                    </p>


                </form>
            </CardContent>

        </Card>
    )
};


