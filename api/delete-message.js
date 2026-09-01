import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.POSTGRES_URL);

export default async function handler(req, res) {

  if(req.method!=="DELETE"){
    return res.status(405).json({message:"Method Not Allowed"});
  }

  const {user,pass,id}=req.query;

  if(
    user!==process.env.ADMIN_USERNAME ||
    pass!==process.env.ADMIN_PASSWORD
  ){
    return res.status(401).json({message:"Unauthorized"});
  }

  try{

    await sql`
      DELETE FROM messages
      WHERE id=${id};
    `;

    return res.status(200).json({
      success:true,
      message:"Message deleted successfully."
    });

  }catch(err){

    return res.status(500).json({
      success:false,
      message:err.message
    });

  }
}