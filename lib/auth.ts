import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireUser(requiredRole?: "ADMIN" | "STUDENT") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("id,full_name,role,direction,group_name,mentor_name").eq("id", user.id).single();
  if (!profile || (requiredRole && profile.role !== requiredRole)) redirect(profile?.role === "ADMIN" ? "/admin" : "/dashboard");
  return { user, profile, supabase };
}

