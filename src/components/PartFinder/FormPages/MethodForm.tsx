import {FC, memo} from "react";
import {Method} from "../../../model/method/Method";
import {Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography} from "@mui/material";

interface MethodFormProps {
  method: string;
  setMethod: (method: string) => void;
}

const MethodForm: FC<MethodFormProps> = ({method, setMethod}) => {

  return (
    <Box className="form">
      <Typography variant='h5' sx={{marginTop: '20px'}}>How will you be using Part Finder?</Typography>
      <FormControl>
        <RadioGroup
          value={method}
          onChange={(event) => setMethod(event.target.value)}>
          <FormControlLabel value={Method.DESKTOP_TO_PHONE} control={<Radio/>} label={Method.DESKTOP_TO_PHONE}/>
          <FormControlLabel value={Method.DESKTOP_TO_DESKTOP} control={<Radio/>} label={Method.DESKTOP_TO_DESKTOP}/>
          <FormControlLabel value={Method.PHONE_TO_PHONE} control={<Radio/>} label={Method.PHONE_TO_PHONE}/>
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default memo(MethodForm);