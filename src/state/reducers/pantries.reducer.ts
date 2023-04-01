import { IPantry } from "../../features/pantries/interfaces/pantry.interface";
import { createMockPantry } from "../../dev-utils";
import { PantriesActionType } from "../action-types";
import { PantriesActions } from "../actions";

interface PantriesState {
  pantries: Map<string, IPantry>;
}

const mockPantries = new Map<string, IPantry>();

for (let i = 0; i < 2; i++) {
  const pantry = createMockPantry();
  mockPantries.set(pantry.uuid, pantry);
}

const initialState: PantriesState = {
  pantries: mockPantries,
};

// todo maybe it's better to call it saved pantries.
const pantriesReducer = (
  // eslint-disable-next-line default-param-last
  state: PantriesState = initialState,
  // eslint-disable-next-line comma-dangle
  action: PantriesActions
): PantriesState => {
  switch (action.type) {
    case PantriesActionType.SAVE_PANTRY:
      state.pantries.set(action.newPantry.uuid, action.newPantry);
      return { ...state, pantries: new Map(state.pantries) };
    case PantriesActionType.DELETE_PANTRY:
      state.pantries.delete(action.pantryToDelete.uuid);
      return { ...state, pantries: new Map(state.pantries) };
    default:
      return state;
  }
};

export default pantriesReducer;
