import { useParams } from "react-router-dom";
import StageNotification from "./StageNotification";
export default function StageNotificationWrapper() {
  const { type } = useParams();
  return <StageNotification type={type} />;
}