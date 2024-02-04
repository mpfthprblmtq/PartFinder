import React, { FC, memo, useState } from "react";
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
  setFilterOnSet: (set: string | undefined) => void;
}

const SetFilterDialog: FC<SetFilterDialogParams> = ({open, onClose, setList, setFilterOnSet}) => {

  const [selectedSet, setSelectedSet] = useState<string>();

  const handleListItemClick = (set: string | undefined) => {
    setSelectedSet(set);
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
            selected={!selectedSet}
            onClick={() => handleListItemClick(undefined)}>
            {!selectedSet ? <strong>All</strong> : 'All'}
          </ListItemButton>
          {setList.map(set => (
            <ListItemButton
              key={set}
              selected={selectedSet === set}
              onClick={() => handleListItemClick(set)}>
              {selectedSet === set ? <strong>{set}</strong> : set}
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