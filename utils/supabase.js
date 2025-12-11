// import { createClient } from '@supabase/supabase-js'
// import type {SupabaseClient} from "@supabase/supabase-js";
//
// let _client: SupabaseClient | null = null
//
// export const getSupabaseClient = (): SupabaseClient => {
//     if (_client) return _client
//     const config = useRuntimeConfig() // safe at call-time (not import-time)
//     _client = createClient(
//         config.public.SUPABASE_URL!,
//         config.public.SUPABASE_ANON_KEY! // <- rename your var; must be anon
// )
//     return _client
// }
