import { Part } from "../model/part/Part";
import { useState } from "react";
import xml2js from "xml2js";

export const useFileUploadService = () => {

  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (files: FileList):Promise<Part[]> => {
    if (!files || files.length === 0) {
      setError('No files selected!');
      return [];
    }

    try {
      const parsedParts: Part[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        const partsData: Promise<Part[]> = new Promise((resolve, reject) => {
          reader.onload = async (event) => {
            const xmlContent = event.target?.result;
            if (typeof xmlContent === 'string') {
              const parser = new xml2js.Parser({ explicitArray: false });
              parser.parseString(xmlContent, (err, result) => {
                if (err) {
                  reject('Failed to parse XML!');
                } else {
                  const partsChunk: Part[] = [];
                  partsChunk.push(...result.INVENTORY.ITEM
                    .filter((xmlItem: any) => xmlItem.MINQTY !== xmlItem.QTYFILLED)
                    .map((xmlItem: any) => {
                      return {
                        id: xmlItem.ITEMID,
                        colorId: xmlItem.COLOR,
                        quantityNeeded: +xmlItem.MINQTY,
                        quantityHave: xmlItem.QTYFILLED ? +xmlItem.QTYFILLED : 0,
                        imageUrl: `https://img.bricklink.com/ItemImage/PN/${xmlItem.COLOR}/${xmlItem.ITEMID}.png`,
                        set: file.name.replace('.xml', '')
                      } as Part;
                    }));
                  resolve(partsChunk);
                }
              });
            }
          };
          reader.readAsText(file);
        });
        parsedParts.push(...await partsData);
      }
      return parsedParts;
    } catch (err) {
      setError('Failed to read files!');
      return [];
    }
  }

  return { error, handleFileUpload };
};