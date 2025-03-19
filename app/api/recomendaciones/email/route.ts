// app/api/recomendaciones/email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendRecommendationsEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, session_id, form_type } = body;

    if (!email || !name || !session_id) {
      return NextResponse.json(
        { success: false, error: "Missing required information" },
        { status: 400 }
      );
    }

    // Get the recommendations from the session
    const coveragesResponse = await fetch(
      `${
        request.nextUrl.origin
      }/api/recomendaciones/coberturas?session_id=${session_id}${
        form_type ? `&form_type=${form_type}` : ""
      }`
    );

    if (!coveragesResponse.ok) {
      throw new Error(
        `Error fetching recommendations: ${coveragesResponse.statusText}`
      );
    }

    const coveragesData = await coveragesResponse.json();

    if (
      !coveragesData.success ||
      !coveragesData.recommendations ||
      coveragesData.recommendations.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "No recommendations found for this session" },
        { status: 404 }
      );
    }

    // Record the email send request in the database
    let emailLogData = null;
    let emailLogError = null;

    try {
      const result = await supabase
        .from("email_logs")
        .insert({
          session_id,
          email,
          name,
          type: "recommendations",
          form_type: form_type || null,
          status: "pending",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      emailLogData = result.data;
      emailLogError = result.error;
    } catch (error) {
      console.log(
        "Failed to log email in database (table might not exist):",
        error
      );
      // Continue execution even if logging fails
    }

    // Send the email with recommendations
    const emailResult = await sendRecommendationsEmail({
      email,
      name,
      recommendations: coveragesData.recommendations,
      tipo: form_type,
    });

    // Update the email log status if we created a log entry
    if (emailLogData && emailLogData.id) {
      await supabase
        .from("email_logs")
        .update({
          status: emailResult.success ? "sent" : "failed",
          updated_at: new Date().toISOString(),
          metadata: emailResult.success
            ? { message_id: emailResult.data?.id }
            : { error: emailResult.error },
        })
        .eq("id", emailLogData.id);
    }

    if (!emailResult.success) {
      console.error("Failed to send recommendations email:", emailResult.error);
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Recommendations sent successfully",
    });
  } catch (error) {
    console.error("Error sending recommendations email:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error sending recommendations email",
      },
      { status: 500 }
    );
  }
}
