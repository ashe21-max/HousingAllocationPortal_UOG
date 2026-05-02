import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const backendUrl = 'http://localhost:4000';
    const response = await fetch(`${backendUrl}/api/applications/${id}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || '',
      },
    });

    // Check if response is OK and content type is JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      return res.status(response.status).json({ 
        message: `Backend API error: ${response.status}`,
        error: errorText 
      });
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error('Backend returned non-JSON response:', contentType, responseText.substring(0, 200));
      return res.status(500).json({ 
        message: 'Backend returned non-JSON response',
        contentType: contentType,
        preview: responseText.substring(0, 200)
      });
    }

    const data = await response.json();
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
