// Supabase Edge Function: send-invitation
// Deploy: supabase functions deploy send-invitation --no-verify-jwt
// Trigger: calls this function after inserting a shared_invitations row

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const APP_URL = Deno.env.get("APP_URL") || "http://localhost:1420";

interface InvitationPayload {
  id: string;
  list_id: string;
  invited_email: string;
  invited_by: string;
  token: string;
}

serve(async (req) => {
  try {
    const { record } = await req.json() as { record: InvitationPayload };
    if (!record) return new Response("No record", { status: 400 });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch list name and inviter name
    const [listRes, profileRes] = await Promise.all([
      supabase.from("shared_lists").select("name").eq("id", record.list_id).single(),
      supabase.from("profiles").select("display_name").eq("id", record.invited_by).single(),
    ]);

    const listName = listRes.data?.name || "a shared list";
    const inviterName = profileRes.data?.display_name || "Someone";
    const acceptUrl = `${APP_URL}/collaboration?accept=${record.token}`;

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "MoneyFlow <onboarding@resend.dev>",
        to: record.invited_email,
        subject: `${inviterName} invited you to "${listName}"`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>${inviterName} invited you</h2>
            <p>Join <strong>${listName}</strong> on MoneyFlow to track shared expenses together.</p>
            <a href="${acceptUrl}"
               style="display: inline-block; background: #2563EB; color: white;
                      padding: 12px 24px; border-radius: 8px; text-decoration: none;
                      font-weight: 600; margin: 16px 0;">
              Accept Invitation
            </a>
            <p style="color: #6B7280; font-size: 12px;">
              If you don't have a MoneyFlow account,
              <a href="${APP_URL}">create one</a> with this email to join.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return new Response(err, { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(String(err), { status: 500 });
  }
});
