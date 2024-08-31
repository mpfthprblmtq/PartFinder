import { Part } from "../model/part/Part";
import { useState } from "react";
import xml2js from "xml2js";

export const useFileUploadService = () => {

  const [error, setError] = useState<string | null>(null);
  const [results, setResults] =
    useState<{files: number, lots: number, parts: number}>();

  const handleFileUpload = async (files: FileList):Promise<Part[]> => {
    if (!files || files.length === 0) {
      setError('No files selected!');
      return [];
    }

    try {
      const parsedParts: Part[] = [];
      let lots: number = 0;
      let parts: number = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        // eslint-disable-next-line no-loop-func
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
                  if (Array.isArray(result.INVENTORY.ITEM)) {
                    partsChunk.push(...result.INVENTORY.ITEM
                      .filter((xmlItem: any) => xmlItem.MINQTY !== xmlItem.QTYFILLED)
                      .map((xmlItem: any) => {
                        const part = {
                          id: xmlItem.ITEMID,
                          colorId: xmlItem.COLOR,
                          quantityNeeded: +xmlItem.MINQTY,
                          originalQuantityNeeded: +xmlItem.MINQTY,
                          quantityHave: xmlItem.QTYFILLED ? +xmlItem.QTYFILLED : 0,
                          originalQuantityHave: xmlItem.QTYFILLED ? +xmlItem.QTYFILLED : 0,
                          imageUrl: `https://img.bricklink.com/ItemImage/PN/${xmlItem.COLOR}/${xmlItem.ITEMID}.png`,
                          set: file.name.replace('.xml', '')
                        } as Part;
                        lots++;
                        parts = parts + (part.quantityNeeded - part.quantityHave);
                        return part;
                      }));
                  } else {
                    // this case is really only for lists with 1 item in it, which shouldn't happen often
                    if (result.INVENTORY.ITEM.MINQTY !== result.INVENTORY.ITEM.QTYFILLED) {
                      const xmlItem = result.INVENTORY.ITEM;
                      const part = {
                        id: xmlItem.ITEMID,
                        colorId: xmlItem.COLOR,
                        quantityNeeded: +xmlItem.MINQTY,
                        originalQuantityNeeded: +xmlItem.MINQTY,
                        quantityHave: xmlItem.QTYFILLED ? +xmlItem.QTYFILLED : 0,
                        originalQuantityHave: xmlItem.QTYFILLED ? +xmlItem.QTYFILLED : 0,
                        imageUrl: `https://img.bricklink.com/ItemImage/PN/${xmlItem.COLOR}/${xmlItem.ITEMID}.png`,
                        set: file.name.replace('.xml', '')
                      } as Part;
                      partsChunk.push(part);
                      lots++;
                      parts = parts + (part.quantityNeeded - part.quantityHave);
                    }
                  }
                  resolve(partsChunk);
                }
              });
            }
          };
          reader.readAsText(file);
        });
        parsedParts.push(...await partsData);
      }
      setResults({files: files.length, lots: lots, parts: parts});
      return parsedParts;
    } catch (err) {
      setError('Failed to read files!');
      return [];
    }
  }

  return { error, results, handleFileUpload };
};