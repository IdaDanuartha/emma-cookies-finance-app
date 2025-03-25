import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async (remember = false) => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // cookieStore.set(name, value, {
              //   ...options,
              //   maxAge: remember ? 60 * 60 * 24 * 30 : undefined, // 30 days
              // });
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            console.error(error)
          }
        },
      },
    }
  );
};


