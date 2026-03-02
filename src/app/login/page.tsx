import { LoginForm } from "@/components/forms/login-form";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Logar() {

    const user = await getUser();

    if (user?.perfil === "ADMIN") {
        redirect("/dashboard");
    };

    return (
        <div className="bg-app-background min-h-screen flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full">
                <LoginForm />

            </div>
        </div>
    )
};