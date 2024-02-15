import React, {FC, memo, useEffect, useRef} from "react";
import {useFileUploadService} from "../../../hooks/useFileUploadService";
import {usePartFinderService} from "../../../hooks/dynamo/usePartFinderService";
import {Box, Button, Typography} from "@mui/material";
import {UploadFile} from "@mui/icons-material";

interface UploadFormProps {
    setId: (id: string) => void;
}

const UploadForm: FC<UploadFormProps> = ({setId}) => {

    const { error, results, handleFileUpload } = useFileUploadService();
    const { saveParts } = usePartFinderService();

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
            await handleFileUpload(files).then( async (parts) => {
                await saveParts(parts).then(id => {
                    setId(id);
                })
            });

            // Clear the value of the file input to trigger onChange event
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
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
                  startIcon={<UploadFile />}>
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
              </Box>
            )}
        </Box>
    );
};

export default memo(UploadForm);