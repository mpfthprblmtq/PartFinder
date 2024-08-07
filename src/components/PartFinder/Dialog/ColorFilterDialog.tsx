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

interface ColorFilterDialogParams {
  open: boolean;
  onClose: () => void;
  colorList: {id: string, color: string}[];
  colorFilterId: string;
  setFilterOnColor: (id: string | undefined) => void;
}

const ColorFilterDialog: FC<ColorFilterDialogParams> = ({open, onClose, colorList, colorFilterId, setFilterOnColor}) => {

  const handleListItemClick = (index: string | undefined) => {
    setFilterOnColor(index);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Filter on Color</DialogTitle>
      <DialogContent>
        <List component='nav'>
          <ListItemButton
            key={'0'}
            selected={!colorFilterId}
            onClick={() => handleListItemClick(undefined)}>
            {!colorFilterId ? <strong>All</strong> : 'All'}
          </ListItemButton>
          {colorList.map(color => (
            <ListItemButton
              key={color.id}
              selected={colorFilterId === color.id}
              onClick={() => handleListItemClick(color.id)}>
              {colorFilterId === color.id ? <strong>{color.color}</strong> : color.color}
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

export default memo(ColorFilterDialog);