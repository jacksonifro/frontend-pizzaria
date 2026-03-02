"use client";

import { ShoppingCart, Package, Tags, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { logoutAction } from "@/actions/autenticar";

interface SidebarProps {
    userName: string;
};


export function Sidebar({ userName }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex w-64 h-screen flex flex-col border-r border-app-border bg-app-sidebar text-white">
            <div className="border-b border-app-border px-4 py-6">
                <div className="space-y-2">
                    <h2 className="text-5xl leading-none text-white">
                        The Jacks
                    </h2>

                    <span className="text-3xl font-extrabold uppercase tracking-widest text-brand-primary">
                        Pizzaria
                    </span>
                </div>

                <div className="mt-4">
                    <p className="text-sm text-gray-300">
                        Bem-vindo {" "}
                        <span className="font-bold text-brand-primary">
                            {userName}
                        </span>
                    </p>
                </div>
            </div>

            <div className="w-64 h-screen bg-app-sidebar text-white">
                <nav className="flex-1 p-4 space-y-2">

                    <Link
                        href="/dashboard"
                        className={cn(
                            "flex items-center gap-3 py-2.5 px-4 rounded transition",
                            pathname === "/dashboard"
                                ? "bg-brand-primary text-white"
                                : "hover:bg-gray-700"
                        )}                    >
                        <ShoppingCart size={20} />
                        <span>Pedidos</span>
                    </Link>

                    <Link
                        href="/dashboard/categories"
                        className={cn(
                            "flex items-center gap-3 py-2.5 px-4 rounded transition",
                            pathname === "/dashboard/categories"
                                ? "bg-brand-primary text-white"
                                : "hover:bg-gray-700"
                        )}                    >
                        <Package size={20} />
                        <span>Categorias</span>
                    </Link>

                    <Link
                        href="/dashboard/products"
                        className={cn(
                            "flex items-center gap-3 py-2.5 px-4 rounded transition",
                            pathname === "/dashboard/products"
                                ? "bg-brand-primary text-white"
                                : "hover:bg-gray-700"
                        )}                    >
                        <Tags size={20} />
                        <span>Produtos</span>
                    </Link>
                </nav>
            </div>

            <div className="border-t border-app-border p-4">
                <form action={logoutAction}>
                    <Button
                        type="submit"
                        variant="ghost"
                        className="w-full justify-start gap-3 text-white hover:bg-gray-700 cursor-pointer">
                        <LogOut size={20} className="w-5 h-5" />
                        Sair
                    </Button>
                </form>
            </div>


        </aside>

    );
}