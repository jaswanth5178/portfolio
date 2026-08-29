import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;

  await sql`
    INSERT INTO messages (name, email, message)
    VALUES (${name}, ${email}, ${message})
  `;

  res.status(200).json({
    success: true,
    message: "Message sent successfully!"
  });
}