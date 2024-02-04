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

interface ColorFilterDialogParams {
  open: boolean;
  onClose: () => void;
  colorList: {id: string, color: string}[];
  setFilterOnColor: (id: string | undefined) => void;
}

const ColorFilterDialog: FC<ColorFilterDialogParams> = ({open, onClose, colorList, setFilterOnColor}) => {

  const [selectedIndex, setSelectedIndex] = useState<string>();

  const handleListItemClick = (index: string | undefined) => {
    setSelectedIndex(index);
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
            selected={!selectedIndex}
            onClick={() => handleListItemClick(undefined)}>
            {!selectedIndex ? <strong>All</strong> : 'All'}
          </ListItemButton>
          {colorList.map(color => (
            <ListItemButton
              key={color.id}
              selected={selectedIndex === color.id}
              onClick={() => handleListItemClick(color.id)}>
              {selectedIndex === color.id ? <strong>{color.color}</strong> : color.color}
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