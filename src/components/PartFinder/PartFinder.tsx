import React, {FunctionComponent, memo, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPartsToStore } from "../../redux/slices/partFinderSlice";
import { usePartFinderService } from "../../hooks/dynamo/usePartFinderService";
import { useNavigate, useParams } from "react-router-dom";
import { Part } from "../../model/part/Part";
import PartsListContainer from "./PartsListContainer/PartsListContainer";
import FormContainer from "./FormContainer/FormContainer";
import Version from "../_shared/Version/Version";
import {Box} from "@mui/material";

const PartFinder: FunctionComponent = () => {

  const parts: Part[] = useSelector((state: any) => state.partFinderStore.parts);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getParts, deleteParts } = usePartFinderService();

  // checks to see if we have the url parameter
  let { urlId } = useParams();
  useEffect(() => {
    if (urlId && parts.length === 0) {
      getPartsFromDatabase(urlId).then(() => {
        deleteParts(urlId!).then(() => {});
        navigate('/');
      });
    }
    // eslint-disable-next-line
  }, []);

  const getPartsFromDatabase = async (id: string) => {
    await getParts(id).then(parts => {
      dispatch(addPartsToStore([...parts]));
    })
  };

  return (
    <Box>
      {parts.length > 0 ? <PartsListContainer parts={parts} /> : <FormContainer />}
      <Version />
    </Box>
  )
};

export default memo(PartFinder);