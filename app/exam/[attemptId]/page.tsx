import { requireUser } from "@/lib/auth";
import { ExamClient } from "@/components/exam-client";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function ExamPage({params}:{params:Promise<{attemptId:string}>}){const {attemptId}=await params;const {user,supabase}=await requireUser('STUDENT');const {data:attempt}=await supabase.from('attempts').select('id,state,deadline_at,violation_count,question_total,exam_id').eq('id',attemptId).eq('student_id',user.id).single();if(!attempt)notFound();return <ExamClient attempt={attempt}/>}

