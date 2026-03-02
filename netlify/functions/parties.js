// netlify/functions/parties.js
const { Client } = require('pg');

const getClient = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  return client;
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const client = await getClient();

  try {
    // GET - Fetch parties for a series
    if (event.httpMethod === 'GET') {
      const seriesId = event.queryStringParameters?.seriesId;
      
      if (!seriesId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'seriesId required' })
        };
      }

      const result = await client.query(
        'SELECT * FROM parties WHERE series_id = $1 ORDER BY date ASC',
        [seriesId]
      );
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.rows)
      };
    }

    // POST - Create new party
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      const result = await client.query(
        `INSERT INTO parties 
         (series_id, date, host, host_email, location, max_guests, kid_friendly, description, guests, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) 
         RETURNING *`,
        [
          data.seriesId,
          data.date,
          data.host,
          data.hostEmail,
          data.location,
          data.maxGuests,
          data.kidFriendly || false,
          data.description || '',
          JSON.stringify(data.guests || [])
        ]
      );
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(result.rows[0])
      };
    }

    // PUT - Update party (including guest list)
    if (event.httpMethod === 'PUT') {
      const data = JSON.parse(event.body);
      const result = await client.query(
        `UPDATE parties 
         SET date = $1, host = $2, host_email = $3, location = $4, 
             max_guests = $5, kid_friendly = $6, description = $7, guests = $8
         WHERE id = $9
         RETURNING *`,
        [
          data.date,
          data.host,
          data.hostEmail,
          data.location,
          data.maxGuests,
          data.kidFriendly || false,
          data.description || '',
          JSON.stringify(data.guests || []),
          data.id
        ]
      );
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.rows[0])
      };
    }

    // DELETE - Delete party
    if (event.httpMethod === 'DELETE') {
      const { id } = JSON.parse(event.body);
      await client.query('DELETE FROM parties WHERE id = $1', [id]);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.end();
  }
};