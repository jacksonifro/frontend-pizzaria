
import { register } from "module";
import { redirect } from "next/navigation";

export default function Home (){
  return (
    redirect("/login")     //Sempre que ele acessar a raiz do site, ele regireciona para a pagina de login
  )
};