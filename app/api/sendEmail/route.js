import nodemailer from "nodemailer";

export const POST = async (req) => {
  try {
    const { generatedByEmail, pdfBuffer } = await req.json();

    // Log the email and partial pdfBuffer to ensure valid data is coming through
    console.log("Email to send:", generatedByEmail);
    console.log("pdfBuffer:", pdfBuffer ? pdfBuffer.substring(0, 100) : "No PDF Buffer");

    // Check if environment variables are set
    console.log("GMAIL_USER:", process.env.GMAIL_USER);
    console.log("GMAIL_PASS:", process.env.GMAIL_PASS);

    // Check if email or pdfBuffer is missing
    if (!generatedByEmail || !pdfBuffer) {
      return new Response(JSON.stringify({ message: "Missing email or PDF attachment." }), {
        status: 400,
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail account
        pass: process.env.GMAIL_PASS, // Your Gmail app password
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: generatedByEmail,
      subject: "Your Customized Car Proposal",
      text: "Please find attached your customized car proposal generated by AutoProposalAI.",
      attachments: [
        {
          filename: `Proposal_${new Date().getTime()}.pdf`,
          content: Buffer.from(pdfBuffer, "base64"),
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: "Email sent successfully" }), {
      status: 200,
    });
  } catch (error) {
    // Log detailed error message
    console.error("Error sending email:", error.message || error);
    return new Response(
      JSON.stringify({ message: `Failed to send email: ${error.message || error}` }),
      {
        status: 500,
      }
    );
  }
};
