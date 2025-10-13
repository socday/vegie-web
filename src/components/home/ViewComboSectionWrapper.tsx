import { useParams } from "react-router-dom";
import ViewComboSection from "./ViewComboSection";
export default function ViewComboSectionWrapper() {
  const { type } = useParams();
  return <ViewComboSection type={type ?? "single"} />;
}