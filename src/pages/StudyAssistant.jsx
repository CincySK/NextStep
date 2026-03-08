import { useSearchParams } from "react-router-dom";
import ChatInterface from "../studyAssistant/ChatInterface";

export default function StudyAssistant() {
  const [params] = useSearchParams();
  const classId = params.get("classId") ?? "";
  const assignmentId = params.get("assignmentId") ?? "";

  return <ChatInterface initialClassId={classId} initialAssignmentId={assignmentId} />;
}
