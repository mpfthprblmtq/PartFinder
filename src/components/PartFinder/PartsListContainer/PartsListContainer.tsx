import React, {FC, memo, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {colorMap} from "../../../utils/ColorMap";
import {Part} from "../../../model/part/Part";
import PartRow from "../PartRow";
import {
  Box,
  Typography
} from "@mui/material";
import {SortBy} from "../../../model/sort/SortBy";
import PartsListNavBar from "./PartsListNavBar";

interface PartsListContainerProps {
  parts: Part[];
}

const PartsListContainer: FC<PartsListContainerProps> = ({parts}) => {

  const [showCompletedParts, setShowCompletedParts] = useState<boolean>(false);
  const [colorList, setColorList] = useState<{ id: string, color: string }[]>([]);
  const [setList, setSetList] = useState<string[]>([]);

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

  return (
    <>
      <PartsListNavBar
        colorList={colorList}
        setList={setList}
        showCompletedParts={showCompletedParts}
        setShowCompletedParts={setShowCompletedParts}
      />
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
    </>
  )
}

export default memo(PartsListContainer);