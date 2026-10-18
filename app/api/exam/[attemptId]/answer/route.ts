import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
const schema=z.object({questionId:z.string().uuid(),optionId:z.string().uuid()});
export async function POST(req:Request,{params}:{params:Promise<{attemptId:string}>}){const {attemptId}=await params;const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'Некорректный ответ'},{status:400});const db=await createClient();const {error}=await db.rpc('save_attempt_answer',{p_attempt_id:attemptId,p_question_id:parsed.data.questionId,p_option_id:parsed.data.optionId});return error?NextResponse.json({error:error.message},{status:409}):NextResponse.json({ok:true});}

