import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { animal, imageUrl } = req.body;

    if (!animal || !imageUrl) {
      return res.status(400).json({ error: 'ERROR!!! please contact fatpotato317@gmail.com to let him know!' });
    }

    if (!['cat', 'dog', 'capybara'].includes(animal)) {
      return res.status(400).json({ error: 'ERROR!!! please contact fatpotato317@gmail.com to let him know!' });
    }

    const urlExtension = imageUrl.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(urlExtension)) {
      return res.status(400).json({ error: 'ERROR!!! please contact fatpotato317@gmail.com to let him know!' });
    }

    try {
      await client.query(
        'INSERT INTO images (animal, image_url) VALUES ($1, $2)',
        [animal, imageUrl]
      );

      return res.status(200).json({ message: 'Image URL added successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'ERROR!!! please contact fatpotato317@gmail.com to let him know!' });
    }
  } else {
    res.status(405).json({ error: 'This is not allowed! please try to make a POST request to this endpoint!' });
  }
}
