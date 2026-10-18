import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function POST(req:Request){const body=await req.formData();const examId=String(body.get('examId')||'');if(body.get('agree')!=='yes')return NextResponse.redirect(new URL(`/exam/start/${examId}?error=agreement`,req.url));const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.redirect(new URL('/login',req.url));const {data,error}=await supabase.rpc('start_exam',{p_exam_id:examId});if(error)return NextResponse.redirect(new URL('/dashboard?error='+encodeURIComponent(error.message),req.url));return NextResponse.redirect(new URL('/exam/'+data,req.url));}

