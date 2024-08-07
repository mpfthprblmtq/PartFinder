import {FC, memo} from "react";
import {Box, Button, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import QRCode from "react-qr-code";
import {Method} from "../../../model/method/Method";
import {OpenInNew} from "@mui/icons-material";

interface QRCodeFormProps {
  id: string;
  method: string;
}

const QRCodeForm: FC<QRCodeFormProps> = ({id, method}) => {
  return (
    <Box className="form">
      {method === Method.DESKTOP_TO_PHONE ? (
        <Box sx={{textAlign: 'center'}}>
          <Typography sx={{marginTop: '20px', marginBottom: '10px'}}>
            Scan this QR code below on your phone, which will open a new tab with your part list.
          </Typography>
          <Typography sx={{marginTop: '10px'}}>
            <Link target='_blank' to={`/${id}`}>Or you can click here to view the parts.</Link>
          </Typography>
          <Box sx={{padding: '10px', marginTop: '10px', marginBottom: '10px', textAlign: 'center'}}>
            <QRCode value={'https://www.prblmtq.com/projects/part-finder/#/' + id}/>
          </Box>
        </Box>
      ) : (
        <Box sx={{textAlign: 'center', marginTop: '20px'}}>
          <Typography sx={{marginBottom: '20px'}}>
            Click the button below to open a new tab with your parts lists:
          </Typography>
          <Button
            href={`/projects/part-finder/#/${id}`}
            target='_blank'
            variant="contained"
            color="primary"
            size='large'
            endIcon={<OpenInNew/>}>
            View Parts
          </Button>
        </Box>
      )}
      <Typography sx={{textAlign: 'center', marginTop: '20px'}}>
        That's it! Happy hunting!
      </Typography>
    </Box>
  );
};

export default memo(QRCodeForm);