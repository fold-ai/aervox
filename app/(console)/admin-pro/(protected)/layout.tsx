import { redirect } from "next/navigation";
import { currentOperator } from "@/lib/auth/operator";

export default async function ProtectedConsoleLayout({ children }: { children: React.ReactNode }) {
  if (!(await currentOperator())) redirect("/admin-pro/login");
  return children;
}
