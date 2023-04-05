// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fsPromises from 'fs/promises';
import path from 'path';
import { string } from 'zod';

const dataFilePath = path.join(process.cwd(), 'json/userData.json');

type Data = {
  url?: string,
  description?: string,
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST'){
    try {
      // Read the existing data from the JSON file
      const jsonData = await fsPromises.readFile(dataFilePath);
      const objectData = JSON.parse(jsonData.toString());

      // Get the data from the request body
      const { url, description } = req.body;
      // Add the new data to the object
      const newData = {
        url,
        description
      };
      objectData[url] = description;
      
      // Convert the object back to a JSON string
      const updatedData = JSON.stringify(objectData);

      // Write the updated data to the JSON file
      await fsPromises.writeFile(dataFilePath, updatedData);

      // Send a success response
      res.status(200).json({ message: 'Data stored successfully' });
    } catch (error) {
      console.error(error);
      // Send an error response
      res.status(500).json({ message: 'Error storing data' });
    }
  }
}

