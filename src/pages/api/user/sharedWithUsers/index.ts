import type { NextApiRequest, NextApiResponse } from 'next';

import clientPromise from '../../../../clients/mongo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { owner, user } = req.query;

  if (!owner || !user) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('dev');

    const ownerDoc = await db.collection('users').findOne({
      email: owner,
      sharedWithUsers: { $elemMatch: { $eq: user } }
    });

    return res.status(200).json({ hasAccess: Boolean(ownerDoc) });
  } catch (error) {
    console.error('Error checking shared access:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
