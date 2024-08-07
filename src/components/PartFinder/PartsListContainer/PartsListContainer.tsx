import React, {FC, memo, useEffect, useState} from "react";
import {
  removeAllPartsFromStore,
  setColorFilterId,
  setSetFilterId,
  setSortBy
} from "../../../redux/slices/partFinderSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {colorMap} from "../../../utils/ColorMap";
import {Part} from "../../../model/part/Part";
import PartRow from "../PartRow";
import {
  AppBar,
  Box,
  Collapse,
  IconButton, List,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  FilterAlt, FilterAltOff,
  Palette,
  Sort,
  ViewList,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import ColorFilterDialog from "../Dialog/ColorFilterDialog";
import SetFilterDialog from "../Dialog/SetFilterDialog";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import TooltipConfirmationModal from "../../_shared/TooltipConfirmationModal/TooltipConfirmationModal";
import SortDialog from "../Dialog/SortDialog";
import {SortBy} from "../../../model/sort/SortBy";

interface PartsListContainerProps {
  parts: Part[];
}

const PartsListContainer: FC<PartsListContainerProps> = ({parts}) => {

  const [showCompletedParts, setShowCompletedParts] = useState<boolean>(false);
  const [colorList, setColorList] = useState<{ id: string, color: string }[]>([]);
  // const [colorFilterId, setColorFilterId] = useState<string>();
  const [setList, setSetList] = useState<string[]>([]);
  // const [setFilter, setSetFilter] = useState<string>();
  // const [sortBy, setSortBy] = useState<SortBy>(SortBy.ID);
  const [clearConfirmationModalOpen, setClearConfirmationModalOpen] = useState(false);
  const [colorFilterDialogOpen, setColorFilterDialogOpen] = useState<boolean>(false);
  const [setFilterDialogOpen, setSetFilterDialogOpen] = useState<boolean>(false);
  const [sortDialogOpen, setSortDialogOpen] = useState<boolean>(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAndSortMenuOpen, setFilterAndSortMenuOpen] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const partsCleared: number = useSelector((state: any) => state.partFinderStore.partsCleared);
  const lotsCleared: number = useSelector((state: any) => state.partFinderStore.lotsCleared);
  const colorFilterId: string = useSelector((state: any) => state.partFinderStore.colorFilterId);
  const setFilterId: string = useSelector((state: any) => state.partFinderStore.setFilterId);
  const sortBy: SortBy = useSelector((state: any) => state.partFinderStore.sortBy);

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
    clearFilters();
    dispatch(removeAllPartsFromStore());
    setShowCompletedParts(false);
    navigate('/');
  }

  const clearFilters = () => {
    dispatch(setColorFilterId(undefined));
    dispatch(setSetFilterId(undefined));
    dispatch(setSortBy(SortBy.ID));
  }

  return (
    <>
      <AppBar position={'fixed'}>
        <Toolbar sx={{backgroundColor: '#BBBBBB'}}>
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
            <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
              <Box sx={{position: 'relative'}}>
                <Typography variant='h5' sx={{color: '#000000', marginRight: '10px'}}>Part Finder</Typography>
              </Box>
              <Box sx={{position: 'relative'}}>
                <img src={'assets/images/part-finder.png'} height={30} alt={'part-finder-img'} />
              </Box>
            </Box>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={(event) => {
              setMenuOpen(!menuOpen);
              setMenuAnchorEl(event.currentTarget);
            }}>
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Menu open={menuOpen} onClose={() => setMenuOpen(!menuOpen)} anchorEl={menuAnchorEl}>
              <MenuItem onClick={() => setFilterAndSortMenuOpen(!filterAndSortMenuOpen)}>
                <ListItemIcon>
                  <FilterAlt fontSize="small" />
                </ListItemIcon>
                <ListItemText>Filter & Sort</ListItemText>
                {filterAndSortMenuOpen ? <ExpandLess /> : <ExpandMore />}
              </MenuItem>
              <Collapse in={filterAndSortMenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {colorList.length > 1 && (
                    <MenuItem onClick={() => setColorFilterDialogOpen(true)} sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <Palette fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Colors</ListItemText>
                    </MenuItem>
                  )}
                  {setList.length > 1 && (
                    <MenuItem onClick={() => setSetFilterDialogOpen(true)} sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <ViewList fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Sets/Lists</ListItemText>
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => setSortDialogOpen(true)} sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <Sort fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sort By...</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => clearFilters()} sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <FilterAltOff fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Clear Filters</ListItemText>
                  </MenuItem>
                </List>
              </Collapse>
              <MenuItem onClick={() => {
                setMenuOpen(false);
                setShowCompletedParts(!showCompletedParts);
              }}>
                <ListItemIcon>
                  {showCompletedParts ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </ListItemIcon>
                <ListItemText>{showCompletedParts ? 'Hide' : 'Show'} Completed</ListItemText>
              </MenuItem>
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
                <MenuItem onClick={() => setClearConfirmationModalOpen(true)}>
                  <ListItemIcon>
                    <CloseIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Reset</ListItemText>
                </MenuItem>
              </TooltipConfirmationModal>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      {menuOpen && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
        }} />
      )}
      <Box sx={{overflowX: 'auto', marginTop: '60px'}}>
        <Typography>{`${partsCleared} ${partsCleared === 1 ? 'part' : 'parts'} found, ${lotsCleared} ${lotsCleared === 1 ? 'lot' : 'lots'} cleared!`}</Typography>
        {parts.filter(part => {
          if (showCompletedParts) {
            return (colorFilterId ? part.colorId === colorFilterId : true) && (setFilterId ? part.set === setFilterId : true);
          } else {
            return (colorFilterId ? part.colorId === colorFilterId : true) && (setFilterId ? part.set === setFilterId : true) && (part.quantityHave !== part.quantityNeeded);
          }
        }).sort((a, b) => {
          switch (sortBy) {
            default:
            case SortBy.ID:
              return a.id.localeCompare(b.id);
            case SortBy.NAME:
              return a.name.localeCompare(b.name);
            case SortBy.NAME_COLOR:
              return (colorMap.get(a.colorId) + ' ' + a.name).localeCompare(colorMap.get(b.colorId) + ' ' + b.name)
            case SortBy.QUANTITY_DESC:
              return b.quantityNeeded - a.quantityNeeded;
            case SortBy.QUANTITY_ASC:
              return a.quantityNeeded - b.quantityNeeded;
          }
        }).map((part, index) => (
          <PartRow part={part} key={index}/>
        ))}
      </Box>
      <ColorFilterDialog
        open={colorFilterDialogOpen}
        onClose={() => setColorFilterDialogOpen(false)}
        colorList={colorList}
        colorFilterId={colorFilterId}
        setFilterOnColor={(colorFilterId) => {
          dispatch(setColorFilterId(colorFilterId));
          setMenuOpen(false);
        }}
      />
      <SetFilterDialog
        open={setFilterDialogOpen}
        onClose={() => setSetFilterDialogOpen(false)}
        setList={setList}
        setFilterId={setFilterId}
        setFilterOnSet={(setFilter) => {
          dispatch(setSetFilterId(setFilter));
          setMenuOpen(false);
        }}
      />
      <SortDialog
        open={sortDialogOpen}
        onClose={() => setSortDialogOpen(false)}
        sortBy={sortBy}
        setSortBy={(sortBy) => {
          dispatch(setSortBy(sortBy));
          setMenuOpen(false);
        }}
      />
    </>
  )
}

export default memo(PartsListContainer);