import { ApiActivityActionType } from "../action-types";
import { ApiActivityActions } from "../actions";

interface ApiActivityState {
  fetchingData: boolean;
}

const initialState: ApiActivityState = {
  fetchingData: false,
};

const apiActivityReducer = (
  // eslint-disable-next-line default-param-last
  state: ApiActivityState = initialState,
  // eslint-disable-next-line comma-dangle
  action: ApiActivityActions
): ApiActivityState => {
  switch (action.type) {
    case ApiActivityActionType.DATA_FETCHING_STARTED:
      return { fetchingData: true };
    case ApiActivityActionType.DATA_FETCHING_FINISHED:
      return { fetchingData: false };
    default:
      return state;
  }
};

export default apiActivityReducer;
