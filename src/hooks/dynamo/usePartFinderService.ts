import { Part } from "../../model/part/Part";
import { db, PartsFinderTable } from "../../db.config";
import { v4 as uuidv4 } from 'uuid';
import dayjs from "dayjs";

interface PartFinderServiceHooks {
  saveParts: (parts: Part[]) => Promise<string>;
  getParts: (id: string) => Promise<Part[]>;
  deleteParts: (id: string) => Promise<void>;
}

export const usePartFinderService = (): PartFinderServiceHooks => {

  const saveParts = async (parts: Part[]): Promise<string> => {
    if (parts && parts.length === 0) {
      throw new Error('Parts is empty!');
    }

    const id: string = uuidv4();
    const params = {
      Item: {
        'id': id,
        'date': dayjs().format('YYYY-MM-DD hh:mma'),
        'parts': JSON.stringify(parts)
      },
      TableName: PartsFinderTable
    };

    try {
      await db.put(params).promise();
      return id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getParts = async (id: string): Promise<Part[]> => {
    const params = { Key: { id: id }, TableName: PartsFinderTable };

    try {
      const parts = await db.get(params).promise();
      if (parts.Item) {
        return JSON.parse(parts.Item.parts) as Part[];
      }
      return [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteParts = async (id: string): Promise<void> => {
    const params = { Key: { 'id': id }, TableName: PartsFinderTable };

    try {
      await db.delete(params).promise();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {saveParts, deleteParts, getParts};
}