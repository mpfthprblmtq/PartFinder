import {FC, useEffect, useState} from "react";
import {Part} from "../../../../model/part/Part";
import {Accordion, AccordionDetails, AccordionSummary, Box} from "@mui/material";
import PartRow from "./PartRow";
import {subtract} from "lodash";
import {ExpandMore} from "@mui/icons-material";
import {SortBy} from "../../../../model/sort/SortBy";
import {colorMap} from "../../../../utils/ColorMap";
import {useSelector} from "react-redux";

interface PartsReportContainerProps {
  parts: Part[];
  setList: string[];
}

const PartsReportContainer: FC<PartsReportContainerProps> = ({parts, setList}) => {

  const [setsMap, setSetsMap] = useState<Map<string, Part[]>>();
  const sortBy: SortBy = useSelector((state: any) => state.partFinderStore.sortBy);

  useEffect(() => {
    const map = new Map<string, Part[]>();
    setList.forEach(set => {
      const partsList = parts.filter(part => part.set === set && subtract(part.quantityHave, part.originalQuantityHave) !== 0);
      if (partsList.length > 0) {
        map.set(set, partsList);
      }
    });
    setSetsMap(map);
  }, [parts, setList]);

  return (
    <Box sx={{overflowX: 'auto', marginTop: '60px'}}>
      {setsMap && setsMap.size > 0 ? Array.from(setsMap.keys()).map(set => (
        <Accordion key={set}>
          <AccordionSummary expandIcon={<ExpandMore />}>{set}</AccordionSummary>
          <AccordionDetails sx={{margin: 0, padding: 0}}>
            {parts
              .filter(part => part.set === set &&
                subtract(part.quantityNeeded, part.quantityHave) !== subtract(part.originalQuantityNeeded, part.originalQuantityHave))
              .sort((a, b) => {
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
              })
              .map((part, index) => (
              <PartRow key={index} part={part} />
            ))}
          </AccordionDetails>
        </Accordion>
      )) : (
        <>Nope</>
      )}
    </Box>
  );
}

export default PartsReportContainer;