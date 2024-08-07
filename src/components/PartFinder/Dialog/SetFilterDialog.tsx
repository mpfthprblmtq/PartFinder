import React, { FC, memo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton
} from "@mui/material";

interface SetFilterDialogParams {
  open: boolean;
  onClose: () => void;
  setList: string[];
  setFilterId: string;
  setFilterOnSet: (set: string | undefined) => void;
}

const SetFilterDialog: FC<SetFilterDialogParams> = ({open, onClose, setList, setFilterId, setFilterOnSet}) => {

  const handleListItemClick = (set: string | undefined) => {
    setFilterOnSet(set);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Filter on Set</DialogTitle>
      <DialogContent>
        <List component='nav'>
          <ListItemButton
            key={'0'}
            selected={!setFilterId}
            onClick={() => handleListItemClick(undefined)}>
            {!setFilterId ? <strong>All</strong> : 'All'}
          </ListItemButton>
          {setList.map(set => (
            <ListItemButton
              key={set}
              selected={setFilterId === set}
              onClick={() => handleListItemClick(set)}>
              {setFilterId === set ? <strong>{set}</strong> : set}
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='primary' onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
};

export default memo(SetFilterDialog);