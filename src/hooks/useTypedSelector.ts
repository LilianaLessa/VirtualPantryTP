// eslint-disable-next-line import/no-extraneous-dependencies
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../state";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
