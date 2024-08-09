import React, {FC, useState} from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import {
  ExpandLess,
  ExpandMore,
  FilterAlt,
  FilterAltOff,
  Palette,
  Sort,
  ViewList, Visibility,
  VisibilityOff
} from "@mui/icons-material";
import TooltipConfirmationModal from "../../_shared/TooltipConfirmationModal/TooltipConfirmationModal";
import ColorFilterDialog from "../Dialog/ColorFilterDialog";
import {
  removeAllPartsFromStore,
  setColorFilterId,
  setSetFilterId, setShowCompleted,
  setSortBy
} from "../../../redux/slices/partFinderSlice";
import SetFilterDialog from "../Dialog/SetFilterDialog";
import SortDialog from "../Dialog/SortDialog";
import {useDispatch, useSelector} from "react-redux";
import {SortBy} from "../../../model/sort/SortBy";
import {useNavigate} from "react-router-dom";

interface PartsListNavBarProps {
  colorList: { id: string, color: string }[];
  setList: string[];
}

const PartsListNavBar: FC<PartsListNavBarProps> = ({colorList, setList}) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAndSortMenuOpen, setFilterAndSortMenuOpen] = useState<boolean>(false);
  const [clearConfirmationModalOpen, setClearConfirmationModalOpen] = useState(false);
  const [colorFilterDialogOpen, setColorFilterDialogOpen] = useState<boolean>(false);
  const [setFilterDialogOpen, setSetFilterDialogOpen] = useState<boolean>(false);
  const [sortDialogOpen, setSortDialogOpen] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const colorFilterId: string = useSelector((state: any) => state.partFinderStore.colorFilterId);
  const setFilterId: string = useSelector((state: any) => state.partFinderStore.setFilterId);
  const sortBy: SortBy = useSelector((state: any) => state.partFinderStore.sortBy);
  const showCompleted: boolean = useSelector((state: any) => state.partFinderStore.showCompleted);

  const clearAllParts = () => {
    clearFilters();
    dispatch(removeAllPartsFromStore());
    navigate('/');
  }

  const clearFilters = () => {
    dispatch(setColorFilterId(undefined));
    dispatch(setSetFilterId(undefined));
    dispatch(setSortBy(SortBy.ID));
    dispatch(setShowCompleted(false));
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
            <IconButton sx={{color: '#000000'}} edge="start" aria-label="menu" onClick={(event) => {
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
                dispatch(setShowCompleted(!showCompleted));
              }}>
                <ListItemIcon>
                  {showCompleted ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </ListItemIcon>
                <ListItemText>{showCompleted ? 'Hide' : 'Show'} Completed</ListItemText>
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
  );
};

export default PartsListNavBar;
