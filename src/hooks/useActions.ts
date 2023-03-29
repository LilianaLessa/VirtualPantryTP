// eslint-disable-next-line import/no-extraneous-dependencies
import { useDispatch } from "react-redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

export const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(actionCreators, dispatch);
};
