import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function GET(){ const db=createAdminClient();const [{data:groups},{data:mentors}]=await Promise.all([db.from("groups").select("id,name").eq("active",true).order("name"),db.from("mentors").select("id,name").eq("active",true).order("name")]);return NextResponse.json({groups,mentors}); }
