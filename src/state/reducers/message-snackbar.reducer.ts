import { MessageSnackbarActions } from "../actions";
import { MessageSnackbarActionType } from "../action-types";

interface MessageSnackbarState {
  errorVisible: boolean;
  errorMessage: string | null;
  infoVisible: boolean;
  infoMessage: string | null;
}

const initialState: MessageSnackbarState = {
  errorVisible: false,
  errorMessage: null,
  infoVisible: false,
  infoMessage: null,
};

const messageSnackbarReducer = (
  // eslint-disable-next-line default-param-last
  state: MessageSnackbarState = initialState,
  // eslint-disable-next-line comma-dangle
  action: MessageSnackbarActions
): MessageSnackbarState => {
  switch (action.type) {
    case MessageSnackbarActionType.SHOW_ERROR:
      return {
        ...state,
        errorVisible: true,
        errorMessage: action.errorMessage,
      };
    case MessageSnackbarActionType.HIDE_ERROR:
      return { ...state, errorVisible: false, errorMessage: null };
    case MessageSnackbarActionType.SHOW_INFO:
      return {
        ...state,
        infoVisible: true,
        infoMessage: action.infoMessage,
      };
    case MessageSnackbarActionType.HIDE_INFO:
      return { ...state, infoVisible: false, infoMessage: null };

    default:
      return state;
  }
};

export default messageSnackbarReducer;
