import React, {FunctionComponent, useEffect, useRef, useState} from "react";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Toolbar, Typography
} from "@mui/material";
import CodeIcon from '@mui/icons-material/Code';
import { colorMap } from "./ColorMap";
import PartRow from "./PartRow";
import { useDispatch, useSelector } from "react-redux";
import { addPartsToStore, removeAllPartsFromStore } from "../../redux/slices/partFinderSlice";
import { useFileUploadService } from "../../hooks/useFileUploadService";
import TooltipConfirmationModal from "../_shared/TooltipConfirmationModal/TooltipConfirmationModal";
import { Clear, Palette, ViewList } from "@mui/icons-material";
import ColorFilterDialog from "./Dialog/ColorFilterDialog";
import SetFilterDialog from "./Dialog/SetFilterDialog";
import { usePartFinderService } from "../../hooks/dynamo/usePartFinderService";
import QRCode from "react-qr-code";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Part } from "./Part";
import Version from "../_shared/Version/Version";

const PartFinder: FunctionComponent = () => {

  const [showCompletedParts, setShowCompletedParts] = useState<boolean>(false);
  const [colorList, setColorList] = useState<{ id: string, color: string }[]>([]);
  const [colorFilterId, setColorFilterId] = useState<string>();
  const [setList, setSetList] = useState<string[]>([]);
  const [setFilter, setSetFilter] = useState<string>();
  const [clearConfirmationModalOpen, setClearConfirmationModalOpen] = useState(false);
  const [colorFilterDialogOpen, setColorFilterDialogOpen] = useState<boolean>(false);
  const [setFilterDialogOpen, setSetFilterDialogOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const parts: Part[] = useSelector((state: any) => state.partFinderStore.parts);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, handleFileUpload } = useFileUploadService();
  const { saveParts, getParts, deleteParts } = usePartFinderService();

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // sets up the color list and the set list we use to filter
  useEffect(() => {
    setColorList(parts.filter(part => {
      if (showCompletedParts) {
        return true;
      } else {
        return part.quantityNeeded !== part.quantityHave;
      }
    }).map(part => {
      return { color: colorMap.get(part.colorId) ?? "", id: part.colorId };
    }).filter(({color, id}, index, self) => {
      return self.findIndex(e => color === e.color && id === e.id) === index;
    }).sort((a, b) => a.color.localeCompare(b.color)));

    setSetList(parts.map(part => part.set)
        .filter((value, index, self) => self.findIndex(e => e === value) === index)
        .sort((a, b) => a.localeCompare(b)));
    // eslint-disable-next-line
  }, [parts]);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const getPartsFromDatabase = async (id: string) => {
    await getParts(id).then(parts => {
      dispatch(addPartsToStore([...parts]));
    })
  }

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

  // clears all parts from the list and resets back to upload view
  const clearAllParts = () => {
    setColorFilterId(undefined);
    setSetFilter(undefined);
    setShowCompletedParts(false);
    setId('');
    dispatch(removeAllPartsFromStore());
    navigate('/');
  }

  return (
    <Box>
      {parts.length > 0 ? (
        <>
          <AppBar position={'fixed'}>
            <Toolbar sx={{backgroundColor: '#BBBBBB'}}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ position: 'relative' }}>
                  <Button
                    variant='contained'
                    startIcon={<Palette />}
                    onClick={() => {setColorFilterDialogOpen(true)}}
                    sx={{marginRight: '5px'}}
                  >Colors</Button>
                  {setList.length > 1 && (
                      <Button
                          variant='contained'
                          startIcon={<ViewList />}
                          onClick={() => {setSetFilterDialogOpen(true)}}
                          sx={{marginRight: '5px'}}
                      >Sets</Button>
                  )}
                </Box>
                <Box sx={{ position: 'relative' }}>
                  <TooltipConfirmationModal
                    content={
                      <Typography sx={{fontSize: '14px', textAlign: 'center'}}>
                        Are you sure you want to clear all items?
                      </Typography>}
                    open={clearConfirmationModalOpen}
                    onClose={() => setClearConfirmationModalOpen(false)}
                    onConfirm={clearAllParts}
                    confirmButtonText={'Clear'}
                    placement={'bottom'}>
                    <Button
                      variant='outlined'
                      color='error'
                      sx={{ position: 'fixed', top: '10px', right: '10px' }}
                      onClick={() => setClearConfirmationModalOpen(true)}
                    >
                      <Clear />
                    </Button>
                  </TooltipConfirmationModal>
                </Box>
              </Box>
            </Toolbar>
          </AppBar>
          <Box sx={{overflowX: 'auto', marginTop: '60px'}}>
            <FormControlLabel
              control={
                <Checkbox
                  value={showCompletedParts}
                  checked={showCompletedParts}
                  onChange={() => {
                    setShowCompletedParts(!showCompletedParts);
                  }}
                />
              }
              label={'Show Completed Parts'} />
            {parts.filter(part => {
              if (showCompletedParts) {
                return (colorFilterId ? part.colorId === colorFilterId : true) && (setFilter ? part.set === setFilter : true);
              } else {
                return (colorFilterId ? part.colorId === colorFilterId : true) && (setFilter ? part.set === setFilter : true) && (part.quantityHave !== part.quantityNeeded);
              }
            }).sort((a, b) => a.id.localeCompare(b.id)).map((part, index) => (
              <PartRow part={part} key={index} />
            ))}
          </Box>
        </>
      ) : (
        <>
          <Typography variant='h4' sx={{marginBottom: '20px'}}>Welcome to Part Finder!</Typography>
          <Typography variant='h5' sx={{marginBottom: '20px'}}>Follow these steps to get set up:</Typography>
          <Typography sx={{marginBottom: '30px'}}>
            <strong>1. </strong>Go to your <a href='https://www.bricklink.com/v2/wanted/list.page' target='_blank' rel='noreferrer'>
            BrickLink Wanted List Page</a> and download any Wanted Lists you want to include.  It might benefit you to
            name the lists based on the sets you're building, since you can filter on the lists you submit.
            You will see those lists downloaded as XML files.<br/><br/>
            You can do this either on your phone or on a computer. (It's a bit easier on a computer, since files get
            saved to weird places on some phones)
          </Typography>
          <Typography sx={{marginBottom: '10px'}}>
            <strong>2. </strong>Hit this button to upload those XML files you just downloaded:
          </Typography>
          <Button
            component="label"
            size='large'
            variant="contained"
            startIcon={<CodeIcon />}
            sx={{ marginLeft: "20px", marginBottom: '30px' }}
          >
            Upload
            <input ref={fileInputRef} type="file" accept=".xml" hidden multiple onChange={onFileChange} />
          </Button>
          {id && !error && (
            <>
              <Typography sx={{marginTop: '20px', marginBottom: '10px'}}>
                <strong>3. </strong>You can either scan this QR code below on your phone, which will open a tab in your
                browser with your part list, <Link target='_blank' to={`/${id}`}>or you can click here to view the
                parts.</Link>
              </Typography>
              <Box sx={{padding: '20px', marginBottom: '30px', textAlign: 'center'}}>
                <QRCode value={'https://prblmtq.com/projects/part-finder/#/' + id} />
              </Box>
              <Typography>
                <strong>4. </strong>That's it!  Either use your phone with the QR code or the device you're on now!  Happy hunting!
              </Typography>
            </>
          )}

        </>
      )}
      <ColorFilterDialog
        open={colorFilterDialogOpen}
        onClose={() => setColorFilterDialogOpen(false)}
        colorList={colorList}
        setFilterOnColor={setColorFilterId}
      />
      <SetFilterDialog
        open={setFilterDialogOpen}
        onClose={() => setSetFilterDialogOpen(false)}
        setList={setList}
        setFilterOnSet={setSetFilter}
      />
      <Version />
    </Box>
  )
};

export default PartFinder;