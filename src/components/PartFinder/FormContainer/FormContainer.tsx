import React, {FC, memo, useState} from "react";
import MethodForm from "../FormPages/MethodForm";
import UploadForm from "../FormPages/UploadForm";
import QRCodeForm from "../FormPages/QRCodeForm";
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import {Method} from "../../../model/method/Method";
import DownloadForm from "../FormPages/DownloadForm";

const FormContainer: FC = () => {

  const [id, setId] = useState<string>('');
  const [method, setMethod] = useState<string>(Method.DESKTOP_TO_PHONE)

  const [currentForm, setCurrentForm] = useState(0);
  const nextForm = () => {
    setCurrentForm((prevForm) => (prevForm < 3 ? prevForm + 1 : prevForm));
  };
  const prevForm = () => {
    setCurrentForm((prevForm) => (prevForm > 0 ? prevForm - 1 : prevForm));
  };

  return (
    <>
      <AppBar position={'fixed'}>
        <Toolbar sx={{backgroundColor: '#BBBBBB'}}>
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
            <Box sx={{position: 'relative'}}>
              <Typography variant='h4' sx={{color: '#000000'}}>Part Finder</Typography>
            </Box>
            <Box sx={{position: 'relative'}}>
              <img src={'assets/images/part-finder.png'} height={40} alt={'part-finder-img'} />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <div className="app">
        <div className="form-container" style={{transform: `translateX(${(100/4) - ((100/4) * currentForm)}%)`, marginLeft: '98%'}}>
          <MethodForm method={method} setMethod={setMethod} />
          <DownloadForm />
          <UploadForm setId={setId} />
          <QRCodeForm id={id} method={method} />
        </div>
        <Box sx={{display: 'flex', justifyContent: 'space-between', marginTop: '20px', width: '100%'}}>
          <Button variant='contained' onClick={prevForm} disabled={currentForm === 0}
                  sx={{width: '120px'}} startIcon={<ChevronLeft/>}>
            Previous
          </Button>
          <Button variant='contained' onClick={nextForm} disabled={currentForm === 3 || (currentForm === 2 && !id)}
                  sx={{width: '120px'}} endIcon={<ChevronRight/>}>
            Next
          </Button>
        </Box>
      </div>
    </>
  );
}

export default memo(FormContainer);