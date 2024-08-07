import React, {FC, memo} from "react";
import {useSelector} from "react-redux";
import {colorMap} from "../../../../utils/ColorMap";
import {Part} from "../../../../model/part/Part";
import {
  Box,
  Typography
} from "@mui/material";
import {SortBy} from "../../../../model/sort/SortBy";
import PartRow from "./PartRow";

interface PartsListContainerProps {
  parts: Part[];
}

const PartsListContainer: FC<PartsListContainerProps> = ({parts}) => {

  const partsCleared: number = useSelector((state: any) => state.partFinderStore.partsCleared);
  const lotsCleared: number = useSelector((state: any) => state.partFinderStore.lotsCleared);
  const colorFilterId: string = useSelector((state: any) => state.partFinderStore.colorFilterId);
  const setFilterId: string = useSelector((state: any) => state.partFinderStore.setFilterId);
  const sortBy: SortBy = useSelector((state: any) => state.partFinderStore.sortBy);
  const showCompleted: boolean = useSelector((state: any) => state.partFinderStore.showCompleted);

  return (
    <Box sx={{overflowX: 'auto', marginTop: '70px'}}>
      <Typography>{`${partsCleared} ${partsCleared === 1 ? 'part' : 'parts'} found, ${lotsCleared} ${lotsCleared === 1 ? 'lot' : 'lots'} cleared!`}</Typography>
      {parts.filter(part => {
        if (showCompleted) {
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
  )
}

export default memo(PartsListContainer);