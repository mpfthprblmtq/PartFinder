import {FunctionComponent} from "react";
import {Typography} from "@mui/material";
import packageJson from '../../../../package.json';

const Version: FunctionComponent = () => {
    return (
        <Typography sx={{ position: 'fixed', bottom: '5px', right: '5px' }}>
            © Pat Ripley / Version: {packageJson.version}
        </Typography>
    );
}

export default Version;