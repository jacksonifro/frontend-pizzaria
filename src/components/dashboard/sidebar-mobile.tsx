"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Package, ShoppingCart, Tags } from "lucide-react";

import { logoutAction } from "@/actions/autenticar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";

interface SidebarMobileProps {
  userName: string;
}

const navItems = [
  {
    href: "/dashboard",
    label: "Pedidos",
    icon: ShoppingCart,
  },
  {
    href: "/dashboard/categories",
    label: "Categorias",
    icon: Package,
  },
  {
    href: "/dashboard/products",
    label: "Produtos",
    icon: Tags,
  },
];

export function SidebarMobile({ userName }: SidebarMobileProps) {
  const pathname = usePathname();

  return (
    <header className="lg:hidden sticky top-0 z-40 border-b border-app-border bg-app-sidebar text-white">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="leading-tight">
          <h1 className="text-lg font-bold">The Jacks</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-brand-primary">Pizzaria</p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-white"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[85%] border-app-border bg-app-sidebar p-0 text-white sm:max-w-xs"
          >
            <div className="border-b border-app-border px-4 py-5">
              <h2 className="text-2xl leading-none text-white">The Jacks</h2>
              <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-primary">
                Pizzaria
              </p>

              <p className="mt-4 text-sm text-gray-300">
                Bem-vindo{" "}
                <span className="font-bold text-brand-primary">{userName}</span>
              </p>
            </div>

            <nav className="flex-1 space-y-2 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded px-4 py-2.5 transition",
                        isActive ? "bg-brand-primary text-white" : "hover:bg-gray-700"
                      )}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>

            <div className="border-t border-app-border p-4">
              <form action={logoutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full justify-start gap-3 text-white hover:bg-gray-700 hover:text-white"
                >
                  <LogOut size={20} className="h-5 w-5" />
                  Sair
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
