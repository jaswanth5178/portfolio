import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  const { user, pass } = req.query;

  // Change these to your own username and password
  if (user !== "jaswanth" || pass !== "yourpassword123") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { rows } = await sql`
    SELECT * FROM messages
    ORDER BY created_at DESC
  `;

  return res.status(200).json(rows);
}