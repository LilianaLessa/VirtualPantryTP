import { IPantry } from "../../features/pantries/interfaces/pantry.interface";
import { PantriesActionType } from "../action-types";
import { PantriesActions } from "../actions";
import DbContext from "../../services/applicationData/localDatabase/classes/db-context.class";
import Pantry from "../../features/pantries/classes/pantry.class";

interface PantriesState {
  pantries: Map<string, IPantry>;
}

const initialState: PantriesState = {
  pantries: new Map<string, IPantry>(),
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
      DbContext.getInstance()
        .database.save(action.newPantry as Pantry)
        .then(() => {
          // console.log("Pantry Persisted");
        })
        .catch(() => {
          // console.log("Pantry persisting error");
        });
      state.pantries.set(action.newPantry.uuid, action.newPantry);
      return { ...state, pantries: new Map(state.pantries) };
    case PantriesActionType.DELETE_PANTRY:
      DbContext.getInstance()
        .database.delete(action.pantryToDelete as Pantry)
        .then(() => {
          // console.log("Pantry deleted");
        })
        .catch(() => {
          // console.log("Pantry deletion error");
        });
      state.pantries.delete(action.pantryToDelete.uuid);
      return { ...state, pantries: new Map(state.pantries) };
    case PantriesActionType.INIT_PANTRY_COLLECTION:
      return {
        ...state,
        pantries: action.pantryCollection.reduce(
          (map: Map<string, IPantry>, p: IPantry) => map.set(p.uuid, p),
          new Map<string, IPantry>()
        ),
      };
    default:
      return state;
  }
};

export default pantriesReducer;
