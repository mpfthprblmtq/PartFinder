import {FC, useEffect, useState} from "react";
import {Part} from "../../../../model/part/Part";
import {Accordion, AccordionDetails, AccordionSummary, Box} from "@mui/material";
import PartRow from "./PartRow";
import {subtract} from "lodash";
import {ExpandMore} from "@mui/icons-material";

interface PartsReportContainerProps {
  parts: Part[];
  setList: string[];
}

const PartsReportContainer: FC<PartsReportContainerProps> = ({parts, setList}) => {

  const [setsMap, setSetsMap] = useState<Map<string, Part[]>>();

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
      {setsMap && Array.from(setsMap.keys()).map(set => (
        <Accordion key={set}>
          <AccordionSummary expandIcon={<ExpandMore />}>{set}</AccordionSummary>
          <AccordionDetails sx={{margin: 0}}>
            {parts
              .filter(part => part.set === set &&
                subtract(part.quantityNeeded, part.quantityHave) !== subtract(part.originalQuantityNeeded, part.originalQuantityHave))
              .map((part, index) => (
              <PartRow key={index} part={part} />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default PartsReportContainer;