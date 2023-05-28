import Configuration from "../../features/configuration/classes/configuration.class";
import { ConfigurationActions } from "../actions";
import { ConfigurationActionType } from "../action-types";

interface ConfigurationState {
  configuration: Configuration | undefined;
}

const initialState: ConfigurationState = {
  configuration: undefined,
};

const configurationReducer = (
  // eslint-disable-next-line default-param-last
  state: ConfigurationState = initialState,
  // eslint-disable-next-line comma-dangle
  action: ConfigurationActions
): ConfigurationState => {
  switch (action.type) {
    case ConfigurationActionType.SET_CONFIGURATION:
      return { ...state, configuration: action.configuration };
    default:
      return state;
  }
};

export default configurationReducer;
