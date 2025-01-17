import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});
client.connect();



export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await client.query("SELECT image_url FROM images WHERE animal = 'cat' ORDER BY RANDOM() LIMIT 1");
      if (result.rows.length > 0) {
        res.status(200).json({ image: result.rows[0].image_url });
      } 
      else {
        res.status(404).json({ error: 'Looks like I have run out of cat images...' });
      }
    } 
    catch (error) {
      res.status(500).json({ error: 'ERROR!!! please contact fatpotato317@gmail.com to let him know!' });
    }
  } 
  else {
    res.status(405).json({ error: 'This is not allowed! please try to make a GET request to this endpoint!' });
  }
}
