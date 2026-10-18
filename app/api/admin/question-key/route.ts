import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
const schema=z.object({questionId:z.string().uuid(),optionId:z.string().uuid()});
export async function POST(req:Request){const p=schema.safeParse(await req.json());if(!p.success)return NextResponse.json({error:'Некорректные данные'},{status:400});const db=await createClient();const {data:{user}}=await db.auth.getUser();const {data:profile}=user?await db.from('profiles').select('role').eq('id',user.id).single():{data:null};if(profile?.role!=='ADMIN')return NextResponse.json({error:'Forbidden'},{status:403});const {error}=await db.from('questions').update({correct_option_id:p.data.optionId,key_confirmed:true}).eq('id',p.data.questionId);return error?NextResponse.json({error:error.message},{status:400}):NextResponse.json({ok:true});}

