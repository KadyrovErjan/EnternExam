/* Run once on a trusted machine; values come from environment variables, never the browser. */
import { createClient } from "@supabase/supabase-js";
async function main(){
const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY, email=process.env.ADMIN_BOOTSTRAP_EMAIL, password=process.env.ADMIN_BOOTSTRAP_PASSWORD;if(!url||!key||!email||!password)throw new Error('Set Supabase URL, service key, ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD.');
const db=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});const {data,error}=await db.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{full_name:'Platform Administrator',direction:'PYTHON'}});if(error && !error.message.toLowerCase().includes('already'))throw error;let id=data.user?.id;if(!id){const {data:users,error:findError}=await db.auth.admin.listUsers();if(findError)throw findError;id=users.users.find(x=>x.email===email)?.id;}if(!id)throw new Error('Admin account could not be resolved.');const {error:updateError}=await db.from('profiles').update({role:'ADMIN'}).eq('id',id);if(updateError)throw updateError;console.log(`Admin bootstrapped: ${email}`);
}
main().catch(error=>{console.error(error);process.exit(1)});
