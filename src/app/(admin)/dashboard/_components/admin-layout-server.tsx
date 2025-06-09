import { redirect } from "next/navigation";
import AdminLayoutClient from "./admin-layout-client";
import { getLoggedInUser } from "@/app/lib/actions";

export default async function AdminLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getLoggedInUser()
  
  if(!user) {
    redirect("/login");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
