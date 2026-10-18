import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function POST(_:Request,{params}:{params:Promise<{attemptId:string}>}){const {attemptId}=await params;const db=await createClient();const {data,error}=await db.rpc('finalize_attempt',{p_attempt_id:attemptId});return error?NextResponse.json({error:error.message},{status:409}):NextResponse.json({attempt:data});}

