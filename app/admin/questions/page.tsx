import { requireUser } from "@/lib/auth";
import { QuestionReview } from "@/components/question-review";
export default async function Questions(){const {supabase}=await requireUser('ADMIN');const {data:questions}=await supabase.from('questions').select('id,body,difficulty,key_confirmed,correct_option_id,exams(title,direction),question_options(id,body,position)').order('created_at').limit(100);return <main className="shell"><header className="nav"><a className="brand" href="/admin">Intern<span>Exam</span></a></header><h1>Проверка ключей</h1><p style={{color:'var(--muted)'}}>Пока хотя бы один ключ не подтверждён, публикация экзамена блокируется на уровне базы данных.</p><QuestionReview initial={questions??[]}/></main>}

