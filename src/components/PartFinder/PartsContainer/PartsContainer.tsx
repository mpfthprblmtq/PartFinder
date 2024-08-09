import React, {FC, useEffect, useState} from "react";
import {Part} from "../../../model/part/Part";
import {CurrentView} from "../../../model/currentView/CurrentView";
import {useSelector} from "react-redux";
import PartsListContainer from "./PartsListContainer/PartsListContainer";
import PartsReportContainer from "./PartsReportContainer/PartsReportContainer";
import PartsContainerNavBar from "./PartsContainerNavBar";
import {colorMap} from "../../../utils/ColorMap";

interface PartsContainerProps {
  parts: Part[];
}

const PartsContainer: FC<PartsContainerProps> = ({parts}) => {

  const [colorList, setColorList] = useState<{ id: string, color: string }[]>([]);
  const [setList, setSetList] = useState<string[]>([]);

  const currentView: CurrentView = useSelector((state: any) => state.partFinderStore.currentView);
  const showCompleted: boolean = useSelector((state: any) => state.partFinderStore.showCompleted);

  // sets up the color list and the set list we use to filter
  useEffect(() => {
    setColorList(parts.filter(part => {
      if (showCompleted) {
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

  return (
    <>
      <PartsContainerNavBar
        colorList={colorList}
        setList={setList}
      />
      {currentView === CurrentView.PART_FINDER ?
        <PartsListContainer parts={parts} /> : <PartsReportContainer parts={parts} setList={setList} />}
    </>
  )
};

export default PartsContainer;