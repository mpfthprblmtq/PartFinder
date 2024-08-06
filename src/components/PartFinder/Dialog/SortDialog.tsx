import React, {FC, memo, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton} from "@mui/material";
import {SortBy} from "../../../model/sort/SortBy";

interface SortDialogParams {
  open: boolean;
  onClose: () => void;
  setSortBy: (sortBy: SortBy) => void;
}

const SortDialog: FC<SortDialogParams> = ({open, onClose, setSortBy}) => {

  const [selectedSortBy, setSelectedSortBy] = useState<SortBy>(SortBy.ID);

  const handleListItemClick = (sortBy: SortBy) => {
    setSelectedSortBy(sortBy);
    setSortBy(sortBy);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Sort Parts By</DialogTitle>
      <DialogContent>
        <List component='nav'>
          <ListItemButton
            selected={selectedSortBy === SortBy.ID}
            onClick={() => handleListItemClick(SortBy.ID)}>
            {selectedSortBy === SortBy.ID ? <strong>Part ID</strong> : 'Part ID'}
          </ListItemButton>
          <ListItemButton
            selected={selectedSortBy === SortBy.NAME}
            onClick={() => handleListItemClick(SortBy.NAME)}>
            {selectedSortBy === SortBy.NAME ? <strong>Name</strong> : 'Name'}
          </ListItemButton>
          <ListItemButton
            selected={selectedSortBy === SortBy.NAME_COLOR}
            onClick={() => handleListItemClick(SortBy.NAME_COLOR)}>
            {selectedSortBy === SortBy.NAME_COLOR ? <strong>Name, Color</strong> : 'Name, Color'}
          </ListItemButton>
          <ListItemButton
            selected={selectedSortBy === SortBy.QUANTITY_DESC}
            onClick={() => handleListItemClick(SortBy.QUANTITY_DESC)}>
            {selectedSortBy === SortBy.QUANTITY_DESC ? <strong>Quantity Needed (Desc)</strong> : 'Quantity Needed (Desc)'}
          </ListItemButton>
          <ListItemButton
            selected={selectedSortBy === SortBy.QUANTITY_ASC}
            onClick={() => handleListItemClick(SortBy.QUANTITY_ASC)}>
            {selectedSortBy === SortBy.QUANTITY_ASC ? <strong>Quantity Needed (Asc)</strong> : 'Quantity Needed (Asc)'}
          </ListItemButton>
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='primary' onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
};

export default memo(SortDialog);