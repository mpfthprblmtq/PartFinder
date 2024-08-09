import React, {FC, memo} from "react";
import {Box, Typography} from "@mui/material";

const DownloadForm: FC = () => {
  return (
    <Box className="form">
      <Typography sx={{marginTop: '20px'}}>
        Go to your <a href='https://www.bricklink.com/v2/wanted/list.page' target='_blank' rel='noreferrer'>
        BrickLink Wanted List Page</a> and download any Wanted Lists you want to include. You can filter
        on the list name, so name them accordingly.<br/>
        You will see those lists downloaded as XML files.<br/><br/>
        You can do this either on your phone or on a computer. (It's a bit easier on a computer, since files get
        saved to weird places on some phones)
      </Typography>
      <hr style={{marginTop: '20px', marginBottom: '20px'}}/>
      <Typography>
        Once you're done downloading your Wanted Lists, hit the next button to upload them in the next step.
      </Typography>
    </Box>
  )
};

export default memo(DownloadForm);