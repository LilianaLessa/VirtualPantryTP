import Group from "../../features/group/classes/group.class";

type StateActions = {
  showSnack: (infoMessage: string) => any;
};
export default class SnackBarService {
  private stateActions?: StateActions;

  constructor(stateActions?: StateActions) {
    this.stateActions = stateActions;
  }

  showGroupSavedInfo(group: Group) {
    this.stateActions?.showSnack(`Group '${group.name}' was saved.`);
  }
}
