import React, {FC, memo} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton} from "@mui/material";
import {SortBy} from "../../../model/sort/SortBy";

interface SortDialogParams {
  open: boolean;
  onClose: () => void;
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
}

const SortDialog: FC<SortDialogParams> = ({open, onClose, sortBy, setSortBy}) => {

  const handleListItemClick = (sortBy: SortBy) => {
    setSortBy(sortBy);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Sort Parts By</DialogTitle>
      <DialogContent>
        <List component='nav'>
          <ListItemButton
            selected={sortBy === SortBy.ID}
            onClick={() => handleListItemClick(SortBy.ID)}>
            {sortBy === SortBy.ID ? <strong>Part ID</strong> : 'Part ID'}
          </ListItemButton>
          <ListItemButton
            selected={sortBy === SortBy.NAME}
            onClick={() => handleListItemClick(SortBy.NAME)}>
            {sortBy === SortBy.NAME ? <strong>Name</strong> : 'Name'}
          </ListItemButton>
          <ListItemButton
            selected={sortBy === SortBy.NAME_COLOR}
            onClick={() => handleListItemClick(SortBy.NAME_COLOR)}>
            {sortBy === SortBy.NAME_COLOR ? <strong>Name, Color</strong> : 'Name, Color'}
          </ListItemButton>
          <ListItemButton
            selected={sortBy === SortBy.QUANTITY_DESC}
            onClick={() => handleListItemClick(SortBy.QUANTITY_DESC)}>
            {sortBy === SortBy.QUANTITY_DESC ? <strong>Quantity Needed (Desc)</strong> : 'Quantity Needed (Desc)'}
          </ListItemButton>
          <ListItemButton
            selected={sortBy === SortBy.QUANTITY_ASC}
            onClick={() => handleListItemClick(SortBy.QUANTITY_ASC)}>
            {sortBy === SortBy.QUANTITY_ASC ? <strong>Quantity Needed (Asc)</strong> : 'Quantity Needed (Asc)'}
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