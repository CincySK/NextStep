import { retrieveAssignmentContext } from "./AssignmentRetriever";

export function buildAIContext({
  message,
  classId,
  selectedAssignmentId,
  useClassContext = true,
  attachmentQuestionRefs = [],
  school,
  user
}) {
  const classObj = useClassContext && classId ? school.classes?.[classId] : null;
  const { assignment, chunks } = useClassContext
    ? retrieveAssignmentContext({
      message,
      school,
      classId,
      selectedAssignmentId,
      attachmentQuestionRefs
    })
    : { assignment: null, chunks: [] };

  return {
    studentName: user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "Student",
    className: classObj?.className ?? null,
    assignmentTitle: assignment?.title ?? null,
    assignmentDescription: assignment?.description ?? null,
    teacherNotes: assignment?.teacherNotes ?? "",
    relevantChunks: chunks.map((chunk) => chunk.textContent).filter(Boolean),
    relevantVisualSummaries: chunks
      .flatMap((chunk) => chunk.pageSummaries ?? [])
      .filter(Boolean)
      .slice(0, 3),
    retrievedChunks: chunks,
    guidance: "Act as a supportive tutor. Guide, explain steps, and avoid doing full homework for the student."
  };
}
