import styled from "styled-components";
import { Entypo } from "@expo/vector-icons";

const NotificationDeleteButtonIcon = styled(Entypo).attrs({
  name: "trash",
})`
  color: rgba(128, 128, 128, 1);
  font-size: 20px;
  margin: 0;
  align-self: flex-start;
`;

export default NotificationDeleteButtonIcon;
