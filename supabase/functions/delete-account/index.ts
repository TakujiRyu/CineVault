import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("delete-account invoked");

    const authHeader = req.headers.get("Authorization");
    console.log("has auth header:", !!authHeader);

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header." }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get("https://worsqggfjgmcrbyyiigb.supabase.co");
    const supabaseAnonKey = Deno.env.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvcnNxZ2dmamdtY3JieXlpaWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MzQ1NDIsImV4cCI6MjA5MjQxMDU0Mn0.XWiexsiHo_hstUqPTdR_HyxvUip_4K-PujfYoxf57Ho");
    const supabaseServiceRoleKey = Deno.env.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvcnNxZ2dmamdtY3JieXlpaWdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgzNDU0MiwiZXhwIjoyMDkyNDEwNTQyfQ.j2Bz3LxWC7J9uWrWoF6__PGXBMa8LSfwV2d9IRodB-0");

    console.log("has SUPABASE_URL:", !!supabaseUrl);
    console.log("has SUPABASE_ANON_KEY:", !!supabaseAnonKey);
    console.log("has SUPABASE_SERVICE_ROLE_KEY:", !!supabaseServiceRoleKey);

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing required environment variables." }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: getUserError,
    } = await userClient.auth.getUser();

    console.log("getUserError:", getUserError?.message ?? null);
    console.log("user id:", user?.id ?? null);

    if (getUserError || !user) {
      return new Response(
        JSON.stringify({ error: getUserError?.message || "Unauthorized." }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

    console.log("deleteError:", deleteError?.message ?? null);

    if (deleteError) {
      return new Response(
        JSON.stringify({ error: deleteError.message }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Account deleted successfully." }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("catch error:", error instanceof Error ? error.message : String(error));

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unexpected error.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
