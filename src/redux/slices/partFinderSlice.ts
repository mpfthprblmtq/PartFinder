import {createSlice} from "@reduxjs/toolkit";
import {Part} from "../../model/part/Part";
import {SortBy} from "../../model/sort/SortBy";
import {CurrentView} from "../../model/currentView/CurrentView";

export interface PartFinderState {
  parts: Part[];
  colorFilterId: string;
  setFilterId: string;
  sortBy: SortBy;
  showCompleted: boolean;
  partsCleared: number;
  lotsCleared: number;
  currentView: CurrentView;
}

const initialState: PartFinderState = {
  parts: [],
  colorFilterId: '',
  setFilterId: '',
  sortBy: SortBy.ID,
  showCompleted: false,
  partsCleared: 0,
  lotsCleared: 0,
  currentView: CurrentView.PART_FINDER
}

export const partFinderSlice = createSlice({
  name: 'partFinder',
  initialState: initialState,
  reducers: {
    addPartsToStore: (state, action) => {
      state.parts = action.payload;
    },
    removeAllPartsFromStore: (state) => {
      state.parts = initialState.parts;
      state.colorFilterId = initialState.colorFilterId;
      state.setFilterId = initialState.setFilterId;
      state.partsCleared = initialState.partsCleared;
      state.lotsCleared = initialState.lotsCleared;
    },
    updatePartCount: (state, action) => {
      const partIndex = state.parts.findIndex(part =>
        part.id === action.payload.id && part.set === action.payload.set && part.colorId === action.payload.colorId
      );
      const originalPart: Part = state.parts[partIndex];
      state.parts[partIndex] = action.payload;

      // if we're increasing the quantity have, that means we should increase the partsCleared and lotsCleared
      if (originalPart.quantityHave < state.parts[partIndex].quantityHave) {
        state.partsCleared++;
        if (state.parts[partIndex].quantityHave === state.parts[partIndex].quantityNeeded) {
          state.lotsCleared++;
        }
      } else {
        state.partsCleared--;
        if (state.parts[partIndex].quantityNeeded - state.parts[partIndex].quantityHave === 1) {
          state.lotsCleared--;
        }
      }
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setColorFilterId: (state, action) => {
      state.colorFilterId = action.payload;
    },
    setSetFilterId: (state, action) => {
      state.setFilterId = action.payload;
    },
    setShowCompleted: (state, action) => {
      state.showCompleted = action.payload;
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    }
  }
});

export const {
  updatePartCount,
  addPartsToStore,
  removeAllPartsFromStore,
  setSortBy,
  setColorFilterId,
  setSetFilterId,
  setShowCompleted,
  setCurrentView
} = partFinderSlice.actions;
export default partFinderSlice.reducer;