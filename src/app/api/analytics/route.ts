import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Insert page visit data
    const { error } = await supabaseAdmin.from("analytics_page_views").insert({
      path: data.path,
      student_nis: data.student_nis || null,
      session_id: data.session_id,
      user_agent: data.user_agent,
      referrer: data.referrer,
      screen_resolution: data.screen_resolution,
      viewport_size: data.viewport_size,
      timestamp: data.timestamp,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Analytics insert error:", error);
      return NextResponse.json({ error: "Failed to record analytics" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
