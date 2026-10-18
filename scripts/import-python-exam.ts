/* Imports the supplied DOCX as a DRAFT. It intentionally never guesses answer keys. */
import fs from "node:fs/promises";
import JSZip from "jszip";
import { createClient } from "@supabase/supabase-js";
type Parsed={sourceKey:string;body:string;difficulty:number;options:string[]};
async function main(){
const input=process.argv[2];
if(!input) throw new Error('Usage: npm run import:python -- "C:\\path\\Тест_Python_Django_DRF.docx"');
function decodeXml(s:string){return s.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#x([0-9A-F]+);/gi,(_,h)=>String.fromCodePoint(parseInt(h,16)));}
async function readParagraphs(path:string){const zip=await JSZip.loadAsync(await fs.readFile(path));const xml=await zip.file('word/document.xml')!.async('string');return [...xml.matchAll(/<w:p[\s\S]*?<\/w:p>/g)].map(x=>decodeXml(x[0]).trim()).filter(Boolean);}
function parse(lines:string[]):Parsed[]{const parsed:Parsed[]=[];for(let i=0;i<lines.length;i++){const header=lines[i].match(/^(\d{1,2})\.\s*(.+)$/);if(!header)continue;const n=Number(header[1]);const body=[header[2]];while(i+1<lines.length&&!/^A\)\s*/.test(lines[i+1]))body.push(lines[++i]);const options:string[]=[];for(const letter of ['A','B','C','D']){const line=lines[++i]||'';const option=line.match(new RegExp(`^${letter}\\)\\s*(.+)$`));if(!option){options.length=0;break;}options.push(option[1].trim());}if(options.length===4)parsed.push({sourceKey:`python-docx-${n}`,body:body.join('\n').trim(),difficulty:n<=15?1:n<=30?2:3,options});}return parsed;}
const questions=parse(await readParagraphs(input));if(questions.length!==45)throw new Error(`Import stopped: expected exactly 45 questions, parsed ${questions.length}.`);
console.log(`Validated DOCX: parsed ${questions.length} questions (${questions.filter(q=>q.difficulty===1).length} easy, ${questions.filter(q=>q.difficulty===2).length} medium, ${questions.filter(q=>q.difficulty===3).length} hard).`);
const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');const db=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
let {data:exam,error}=await db.from('exams').select('id').eq('direction','PYTHON').eq('state','DRAFT').maybeSingle();if(error)throw error;if(!exam){const r=await db.from('exams').insert({title:'Python, Django и DRF — вступительный тест',direction:'PYTHON',state:'DRAFT',duration_minutes:60,pass_percentage:70}).select('id').single();if(r.error)throw r.error;exam=r.data;}
for(const q of questions){const existing=await db.from('questions').select('id').eq('exam_id',exam.id).eq('source_key',q.sourceKey).maybeSingle();if(existing.error)throw existing.error;if(existing.data)continue;const created=await db.from('questions').insert({exam_id:exam.id,source_key:q.sourceKey,body:q.body,difficulty:q.difficulty,key_confirmed:false}).select('id').single();if(created.error)throw created.error;const inserted=await db.from('question_options').insert(q.options.map((body,idx)=>({question_id:created.data.id,position:idx+1,body})));if(inserted.error)throw inserted.error;}
const {count,error:countError}=await db.from('questions').select('*',{count:'exact',head:true}).eq('exam_id',exam.id);if(countError)throw countError;if(count!==45)throw new Error(`Integrity check failed: exam contains ${count} questions, expected 45.`);console.log(`Imported/verified ${count} Python questions in DRAFT ${exam.id}. All keys remain unconfirmed.`);
}
main().catch(error=>{console.error(error);process.exit(1)});

