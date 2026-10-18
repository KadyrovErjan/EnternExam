import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
const schema=z.object({type:z.enum(['TAB_HIDDEN','WINDOW_BLUR','PAGE_EXIT','PAGE_RELOAD','NAVIGATION','OFFLINE','ONLINE','HEARTBEAT_MISSING','REOPENED']),dedupeKey:z.string().min(3).max(100),context:z.record(z.string(),z.unknown()).optional()});
export async function POST(req:Request,{params}:{params:Promise<{attemptId:string}>}){const {attemptId}=await params;const p=schema.safeParse(await req.json());if(!p.success)return NextResponse.json({error:'Некорректное событие'},{status:400});const db=await createClient();const {data,error}=await db.rpc('record_violation',{p_attempt_id:attemptId,p_type:p.data.type,p_context:p.data.context||{},p_dedupe_key:p.data.dedupeKey});return error?NextResponse.json({error:error.message},{status:409}):NextResponse.json({count:data});}

