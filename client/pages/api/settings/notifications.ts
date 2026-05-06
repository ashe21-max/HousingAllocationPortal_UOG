import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const backendUrl = 'http://localhost:4000';
    
    if (req.method === 'GET') {
      // Get notifications
      const response = await fetch(`${backendUrl}/api/settings/notifications`, {
        method: 'GET',
        headers: {
          'Cookie': req.headers.cookie || '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend API error:', response.status, errorText);
        return res.status(response.status).json({ 
          message: `Backend API error: ${response.status}`,
          error: errorText 
        });
      }

      const data = await response.json();
      return res.status(response.status).json(data);
    } else {
      // Update notification preferences
      const response = await fetch(`${backendUrl}/api/settings/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': req.headers.cookie || '',
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend API error:', response.status, errorText);
        return res.status(response.status).json({ 
          message: `Backend API error: ${response.status}`,
          error: errorText 
        });
      }

      const data = await response.json();
      return res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('API proxy error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
