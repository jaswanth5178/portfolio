import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { name, email, message } = req.body;

    await sql`
      INSERT INTO messages (name, email, message)
      VALUES (${name}, ${email}, ${message});
    `;

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}