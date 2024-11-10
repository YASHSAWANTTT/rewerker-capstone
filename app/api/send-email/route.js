import nodemailer from 'nodemailer';

// Handle POST request for sending the email
export async function POST(req) {
  try {
    const { recipientEmail, claimedBy, itemId, firstName } = await req.json(); // Parse the JSON body from the request

    // Set up the Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or another email service
      auth: {
        user: process.env.EMAIL_USER, // From environment variables
        pass: process.env.EMAIL_PASSWORD, // From environment variables
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: 'Material Claimed Notification',
      text: `Hi ${firstName},\n\nYour item has been claimed by ${claimedBy}. Please bring your listed item to the Trashy Market on November 29th or November 30th to Mrs. Murphy's Irish Bistro on 3905 N Lincoln Ave.\n\nThank you for your contribution, see you there!\n\nBest,\nNowhere Collective`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success response
    return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error.message);

    // Return error response
    return new Response(
      JSON.stringify({ message: 'Error sending email', error: error.message }),
      { status: 500 }
    );
  }
}
