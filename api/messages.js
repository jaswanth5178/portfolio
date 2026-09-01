import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.POSTGRES_URL);

export default async function handler(req, res) {
  const { user, pass } = req.query;

  if (
    user !== process.env.ADMIN_USERNAME ||
    pass !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const rows = await sql`
      SELECT * FROM messages
      ORDER BY created_at DESC;
    `;

    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}