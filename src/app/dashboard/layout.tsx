import { verificarAdmin } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await verificarAdmin();   
    
  
  return (    
        <div>
            {children}  
        </div>
    );
}   