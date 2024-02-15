import {FC, memo, useEffect, useState} from "react";
import {removeAllPartsFromStore} from "../../../redux/slices/partFinderSlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {colorMap} from "../../../utils/ColorMap";
import {Part} from "../../../model/part/Part";
import TooltipConfirmationModal from "../../_shared/TooltipConfirmationModal/TooltipConfirmationModal";
import PartRow from "../PartRow";
import {AppBar, Box, Button, Checkbox, FormControlLabel, Toolbar, Typography} from "@mui/material";
import {Clear, Palette, ViewList} from "@mui/icons-material";
import ColorFilterDialog from "../Dialog/ColorFilterDialog";
import SetFilterDialog from "../Dialog/SetFilterDialog";

interface PartsListContainerProps {
  parts: Part[];
}

const PartsListContainer: FC<PartsListContainerProps> = ({parts}) => {

  const [showCompletedParts, setShowCompletedParts] = useState<boolean>(false);
  const [colorList, setColorList] = useState<{ id: string, color: string }[]>([]);
  const [colorFilterId, setColorFilterId] = useState<string>();
  const [setList, setSetList] = useState<string[]>([]);
  const [setFilter, setSetFilter] = useState<string>();
  const [clearConfirmationModalOpen, setClearConfirmationModalOpen] = useState(false);
  const [colorFilterDialogOpen, setColorFilterDialogOpen] = useState<boolean>(false);
  const [setFilterDialogOpen, setSetFilterDialogOpen] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // sets up the color list and the set list we use to filter
  useEffect(() => {
    setColorList(parts.filter(part => {
      if (showCompletedParts) {
        return true;
      } else {
        return part.quantityNeeded !== part.quantityHave;
      }
    }).map(part => {
      return {color: colorMap.get(part.colorId) ?? "", id: part.colorId};
    }).filter(({color, id}, index, self) => {
      return self.findIndex(e => color === e.color && id === e.id) === index;
    }).sort((a, b) => a.color.localeCompare(b.color)));

    setSetList(parts.map(part => part.set)
      .filter((value, index, self) => self.findIndex(e => e === value) === index)
      .sort((a, b) => a.localeCompare(b)));
    // eslint-disable-next-line
  }, [parts]);

  // clears all parts from the list and resets back to upload view
  const clearAllParts = () => {
    setColorFilterId(undefined);
    setSetFilter(undefined);
    setShowCompletedParts(false);
    // setId('');
    dispatch(removeAllPartsFromStore());
    navigate('/');
  }

  return (
    <>
      <AppBar position={'fixed'}>
        <Toolbar sx={{backgroundColor: '#BBBBBB'}}>
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
            <Box sx={{position: 'relative'}}>
              <Button
                variant='contained'
                startIcon={<Palette />}
                onClick={() => {
                  setColorFilterDialogOpen(true)
                }}
                sx={{marginRight: '5px'}}
              >Colors</Button>
              {setList.length > 1 && (
                <Button
                  variant='contained'
                  startIcon={<ViewList />}
                  onClick={() => {
                    setSetFilterDialogOpen(true)
                  }}
                  sx={{marginRight: '5px'}}
                >Sets</Button>
              )}
            </Box>
            <Box sx={{position: 'relative'}}>
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
                  sx={{position: 'fixed', top: '10px', right: '10px'}}
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
          label={'Show Completed Parts'}/>
        {parts.filter(part => {
          if (showCompletedParts) {
            return (colorFilterId ? part.colorId === colorFilterId : true) && (setFilter ? part.set === setFilter : true);
          } else {
            return (colorFilterId ? part.colorId === colorFilterId : true) && (setFilter ? part.set === setFilter : true) && (part.quantityHave !== part.quantityNeeded);
          }
        }).sort((a, b) => a.id.localeCompare(b.id)).map((part, index) => (
          <PartRow part={part} key={index}/>
        ))}
      </Box>
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
    </>
  )
}

export default memo(PartsListContainer);