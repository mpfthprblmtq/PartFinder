import React, {FC, memo, useEffect, useRef, useState} from "react";
import {useFileUploadService} from "../../../hooks/useFileUploadService";
import {usePartFinderService} from "../../../hooks/dynamo/usePartFinderService";
import {Box, Button, LinearProgress, Typography} from "@mui/material";
import {UploadFile} from "@mui/icons-material";
import {useBrickLinkService} from "../../../hooks/useBrickLinkService";
import {Part} from "../../../model/part/Part";

interface UploadFormProps {
  setId: (id: string) => void;
}

const UploadForm: FC<UploadFormProps> = ({setId}) => {

  const {error, results, handleFileUpload} = useFileUploadService();
  const {saveParts} = usePartFinderService();
  const {getBricklinkData} = useBrickLinkService();
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  // pulls in files after upload
  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      await handleFileUpload(files).then(async (parts) => {

        // setLoading(true);
        const hydratedParts = await populateNamesInChunksWithRetry(parts, getBricklinkData);

        console.log(hydratedParts)
        await saveParts(hydratedParts).then(id => {
          setId(id);
          // setLoading(false);
        })
      });

      // Clear the value of the file input to trigger onChange event
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Function to make API calls asynchronously in chunks of 5 with retries for failed calls, avoiding duplicate IDs
  async function populateNamesInChunksWithRetry(parts: Part[], getBrickLinkData: (part: Part) => Promise<Part>, maxRetries: number = 3): Promise<Part[]> {
    const chunkSize = 5;
    const chunks = [];
    let chunksProcessed = 0;

    // Split the parts array into chunks of 5
    for (let i = 0; i < parts.length; i += chunkSize) {
      chunks.push(parts.slice(i, i + chunkSize));
    }

    const encounteredIds: Set<string> = new Set(); // Set to keep track of encountered IDs

    // Process each chunk concurrently
    const processedChunks = await Promise.all(chunks.map(async (chunk) => {
      let retries = 0;
      let chunkProcessed = false;
      let chunkResult: Part[] = [];

      while (!chunkProcessed && retries <= maxRetries) {
        try {
          // Make API calls for each part in the chunk
          const promises = chunk
            .filter(part => !encounteredIds.has(part.id)) // Filter out parts with encountered IDs
            .map(part => getBrickLinkData(part)); // Map to API call promises

          // Wait for all API calls in the chunk to complete
          chunkResult = await Promise.all(promises);

          // Update encountered IDs with parts from this chunk
          chunk.forEach(part => encounteredIds.add(part.id));
          chunkProcessed = true;
        } catch (error) {
          // console.error(`Error processing chunk: ${error}`);
          retries++;
          // console.log(`Retrying chunk (${retries}/${maxRetries})...`);
        }
      }

      setProgressPercentage((chunksProcessed / chunks.length) * 100);
      chunksProcessed++;
      return chunkResult;
    }));

    setProgressPercentage(100)
    // Flatten the processed chunks back into a single array
    return processedChunks.reduce((acc, val) => acc.concat(val), []);
  }

  return (
    <Box className="form">
      <Typography sx={{marginTop: '20px'}}>
        Hit this button to upload those XML files you just downloaded:
      </Typography>
      <Box sx={{textAlign: 'center', marginTop: "20px"}}>
        <Button
          component="label"
          size='large'
          variant="contained"
          startIcon={<UploadFile/>}>
          Upload
          <input ref={fileInputRef} type="file" accept=".xml" hidden multiple onChange={onFileChange}/>
        </Button>
      </Box>

      {results && (
        <Box sx={{marginTop: '20px', textAlign: 'center'}}>
          <Typography sx={{fontSize: '18px'}}>
            {`${results.files} ${results.files === 1 ? 'file' : 'files'} loaded!`}
          </Typography>
          <Typography sx={{fontSize: '18px'}}>
            {`${results.lots} individual ${results.lots === 1 ? 'lot' : 'lots'}, ${results.parts} total ${results.parts === 1 ? 'part' : 'parts'}!`}
          </Typography>
          <Box sx={{marginTop: '20px', textAlign: 'center'}}>
            <Typography sx={{fontSize: '18px'}}>
              Getting part data...
            </Typography>
            <LinearProgress value={progressPercentage} variant='determinate' sx={{margin: 'auto', width: '75vw', marginTop: '10px'}}/>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default memo(UploadForm);