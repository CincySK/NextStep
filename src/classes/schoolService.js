import { createEmbedding } from "../ai/EmbeddingService";
import { loadSchoolData, updateSchoolData } from "./sharedSchoolStore";

function createId(prefix) {
  const safePrefix = prefix ?? "id";
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${safePrefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${safePrefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function createJoinCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function unique(array) {
  return Array.from(new Set(array));
}

export function getCurrentUserId(user, isGuestMode = false) {
  if (isGuestMode) return "guest";
  if (!user?.id) return null;
  return user.id;
}

export function getCurrentDisplayName(user, isGuestMode = false) {
  if (isGuestMode) return "Guest Student";
  return user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "Student";
}

export function getClassByCode(code) {
  const school = loadSchoolData();
  const normalized = String(code ?? "").trim().toUpperCase();
  if (!normalized) return null;
  return Object.values(school.classes).find(
    (item) => String(item.classCode ?? "").toUpperCase() === normalized
  ) ?? null;
}

export function canAccessClass({ school, classId, userId }) {
  const classObj = school.classes?.[classId];
  if (!classObj || !userId) return false;
  return classObj.teacherId === userId || classObj.students?.includes(userId);
}

export function canManageClass({ school, classId, userId }) {
  const classObj = school.classes?.[classId];
  if (!classObj || !userId) return false;
  return classObj.teacherId === userId;
}

export function createClass({ teacherId, className, subject, description }) {
  if (!teacherId) throw new Error("You must be signed in to create a class.");
  if (!className?.trim()) throw new Error("Class name is required.");

  let createdClassId = "";
  const school = updateSchoolData((current) => {
    const classId = createId("class");
    createdClassId = classId;
    const classCode = createJoinCode();
    const nextClass = {
      classId,
      teacherId,
      className: className.trim(),
      subject: String(subject ?? "").trim(),
      description: String(description ?? "").trim(),
      classCode,
      students: [],
      assignmentIds: [],
      createdAt: new Date().toISOString()
    };

    return {
      ...current,
      classes: {
        ...current.classes,
        [classId]: nextClass
      },
      classOrder: [classId, ...(current.classOrder ?? [])],
      teacherClasses: {
        ...current.teacherClasses,
        [teacherId]: unique([...(current.teacherClasses?.[teacherId] ?? []), classId])
      }
    };
  });
  return { school, classId: createdClassId };
}

export function joinClass({ userId, classCode }) {
  if (!userId) throw new Error("You must be signed in to join a class.");
  const classObj = getClassByCode(classCode);
  if (!classObj) throw new Error("Class code not found.");

  return updateSchoolData((current) => {
    const existing = current.classes?.[classObj.classId];
    if (!existing) return current;
    const nextStudents = unique([...(existing.students ?? []), userId]);

    return {
      ...current,
      classes: {
        ...current.classes,
        [existing.classId]: {
          ...existing,
          students: nextStudents
        }
      },
      studentClasses: {
        ...current.studentClasses,
        [userId]: unique([...(current.studentClasses?.[userId] ?? []), existing.classId])
      }
    };
  });
}

export function createAssignment({
  teacherId,
  classId,
  title,
  description,
  dueDate,
  teacherNotes,
  materials = []
}) {
  if (!teacherId) throw new Error("You must be signed in.");
  if (!classId) throw new Error("Select a class first.");
  if (!title?.trim()) throw new Error("Assignment title is required.");

  let createdAssignmentId = "";
  const school = updateSchoolData((current) => {
    const classObj = current.classes?.[classId];
    if (!classObj || classObj.teacherId !== teacherId) {
      throw new Error("Only the class teacher can add assignments.");
    }

    const assignmentId = createId("asg");
    createdAssignmentId = assignmentId;
    const assignment = {
      assignmentId,
      classId,
      title: title.trim(),
      description: String(description ?? "").trim(),
      materials: Array.isArray(materials) ? materials : [],
      uploadedFiles: [],
      dueDate: dueDate || "",
      teacherNotes: String(teacherNotes ?? "").trim(),
      createdAt: new Date().toISOString()
    };

    const nextClass = {
      ...classObj,
      assignmentIds: unique([assignmentId, ...(classObj.assignmentIds ?? [])])
    };

    return {
      ...current,
      assignments: {
        ...current.assignments,
        [assignmentId]: assignment
      },
      assignmentOrder: [assignmentId, ...(current.assignmentOrder ?? [])],
      classes: {
        ...current.classes,
        [classId]: nextClass
      }
    };
  });
  return { school, assignmentId: createdAssignmentId };
}

export function attachAssignmentDocuments({
  assignmentId,
  classId,
  files = [],
  chunksByFile = [],
  processedMaterials = []
}) {
  if (!assignmentId || !classId) return loadSchoolData();

  return updateSchoolData((current) => {
    const assignment = current.assignments?.[assignmentId];
    if (!assignment) return current;

    const nextDocuments = { ...current.documents };
    const uploadedFiles = [...(assignment.uploadedFiles ?? [])];

    const normalized = [];

    if (processedMaterials.length > 0) {
      processedMaterials.forEach((item) => normalized.push(item));
    } else {
      chunksByFile.forEach((item, fileIndex) => {
        const file = files[fileIndex];
        const fileName = file?.name ?? item?.fileName ?? `materials_${fileIndex + 1}.txt`;
        normalized.push({
          fileName,
          mimeType: file?.type ?? "",
          fileType: "text",
          extractedText: "",
          pageSummaries: [],
          imageMetadata: [],
          chunks: (item?.chunks ?? []).map((chunkText, chunkIndex) => ({
            textContent: chunkText,
            pageNumber: 1,
            sectionTitle: `${fileName} - part ${chunkIndex + 1}`,
            sourceType: "text",
            fileType: "text",
            questionNumber: null
          }))
        });
      });
    }

    normalized.forEach((item, fileIndex) => {
      const file = files[fileIndex];
      const fileName = file?.name ?? item?.fileName ?? `materials_${fileIndex + 1}.txt`;
      uploadedFiles.push(fileName);

      (item?.chunks ?? []).forEach((chunk, chunkIndex) => {
        const chunkText = chunk?.textContent ?? "";
        if (!chunkText?.trim()) return;
        const documentId = createId("doc");
        nextDocuments[documentId] = {
          documentId,
          assignmentId,
          classId,
          fileType: item?.fileType ?? "text",
          mimeType: item?.mimeType ?? file?.type ?? "",
          extractedText: item?.extractedText ?? "",
          pageSummaries: item?.pageSummaries ?? [],
          imageMetadata: item?.imageMetadata ?? [],
          pageNumber: chunk?.pageNumber ?? 1,
          questionNumber: chunk?.questionNumber ?? null,
          sourceType: chunk?.sourceType ?? "text",
          sectionTitle: chunk?.sectionTitle ?? `${fileName} - part ${chunkIndex + 1}`,
          fileName,
          textContent: chunkText,
          embedding: createEmbedding(chunkText)
        };
      });
    });

    return {
      ...current,
      documents: nextDocuments,
      assignments: {
        ...current.assignments,
        [assignmentId]: {
          ...assignment,
          uploadedFiles: unique(uploadedFiles)
        }
      }
    };
  });
}

export function getClassesForUser({ userId }) {
  const school = loadSchoolData();
  const enrolled = school.studentClasses?.[userId] ?? [];
  const teaching = school.teacherClasses?.[userId] ?? [];
  const allClassIds = unique([...teaching, ...enrolled]);

  return allClassIds
    .map((id) => school.classes?.[id])
    .filter(Boolean);
}
