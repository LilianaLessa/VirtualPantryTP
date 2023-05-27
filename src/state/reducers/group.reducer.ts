import Group from "../../features/group/classes/group.class";
import { GroupsActionType } from "../action-types";
import { GroupsActions } from "../actions";

interface GroupsState {
  groups: Map<string, Group>;
  memberInGroups: Map<string, Group>;
}

const initialState: GroupsState = {
  groups: new Map<string, Group>(),
  memberInGroups: new Map<string, Group>(),
};

const groupsReducer = (
  // eslint-disable-next-line default-param-last
  state: GroupsState = initialState,
  // eslint-disable-next-line comma-dangle
  action: GroupsActions
): GroupsState => {
  switch (action.type) {
    case GroupsActionType.SAVE_GROUP:
      state.groups.set(action.group.uuid, action.group);
      return { ...state, groups: new Map(state.groups) };
    case GroupsActionType.DELETE_GROUP:
      state.groups.delete(action.group.uuid);
      return { ...state, groups: new Map(state.groups) };
    case GroupsActionType.INIT_GROUP_COLLECTION:
      return {
        ...state,
        groups: action.groupCollection.reduce(
          (map: Map<string, Group>, p: Group) => map.set(p.uuid, p),
          new Map<string, Group>()
        ),
      };
    case GroupsActionType.INIT_MEMBER_IN_GROUP_COLLECTION:
      return {
        ...state,
        memberInGroups: action.groupCollection.reduce(
          (map: Map<string, Group>, p: Group) => map.set(p.uuid, p),
          new Map<string, Group>()
        ),
      };
    default:
      return state;
  }
};

export default groupsReducer;
