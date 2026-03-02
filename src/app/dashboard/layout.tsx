import { SidebarMobile } from "@/components/dashboard/sidebar-mobile";
import { Sidebar } from "@/components/dashboard/sidebar";
import { verificarAdmin } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await verificarAdmin();

  return (
    <div className="flex h-screen overflow-hidden text-black">
      <Sidebar userName={user.nome} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <SidebarMobile userName={user.nome} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
