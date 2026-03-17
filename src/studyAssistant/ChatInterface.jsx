import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { generateTutorReply } from "../ai/AIChatService";
import { canAccessClass, getCurrentUserId } from "../classes/schoolService";
import { loadSchoolData } from "../classes/sharedSchoolStore";
import { loadAppData, updateAppData } from "../storage";
import ProgressBadge from "../components/ProgressBadge";
import AssignmentSelector from "./AssignmentSelector";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

function buildThreadKey(classId, assignmentId) {
  return `${classId || "general"}::${assignmentId || "none"}`;
}

function defaultWelcomeMessage() {
  return [{
    id: "welcome",
    role: "assistant",
    text: "Hi, I am your NextStep Study Assistant. I can help with math, writing, concepts, worksheet screenshots, and handwritten steps. Tell me what you are working on.",
    timestamp: new Date().toISOString(),
    context: null,
    attachments: []
  }];
}

function serializeAttachments(items = []) {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    size: item.size,
    mimeType: item.mimeType,
    previewUrl: ""
  }));
}

function getLoadingLabel(attachments, message) {
  if (!attachments?.length) return "Thinking through this with your context...";
  const lower = String(message ?? "").toLowerCase();
  if (/math|equation|algebra|solve|wrong/.test(lower)) return "Looking at your math steps...";
  if (/worksheet|question|homework|4a|6a/.test(lower)) return "Analyzing worksheet...";
  return "Reading image and assignment details...";
}

export default function ChatInterface({ initialClassId = "", initialAssignmentId = "" }) {
  const { user, isGuestMode } = useAuth();
  const userId = getCurrentUserId(user, isGuestMode) ?? "anonymous";
  const [school, setSchool] = useState(() => loadSchoolData());
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("Thinking through this with your context...");
  const [useClassContext, setUseClassContext] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState(initialClassId);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(initialAssignmentId);
  const [messages, setMessages] = useState(() => {
    const data = loadAppData();
    const selections = data.studyAssistant?.selectedAssignmentByUser?.[userId];
    const classId = initialClassId || selections?.classId || "";
    const assignmentId = initialAssignmentId || selections?.assignmentId || "";
    const key = buildThreadKey(classId, assignmentId);
    const saved = data.studyAssistant?.conversationsByUser?.[userId]?.[key] ?? [];
    return saved.length > 0 ? saved : defaultWelcomeMessage();
  });
  const messageEndRef = useRef(null);

  useEffect(() => {
    setSchool(loadSchoolData());
  }, []);

  useEffect(() => () => {
    attachments.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
  }, [attachments]);

  const accessibleClasses = useMemo(
    () =>
      Object.values(school.classes ?? {}).filter((item) =>
        canAccessClass({ school, classId: item.classId, userId })
      ),
    [school, userId]
  );

  const assignmentsByClass = useMemo(() => {
    const map = {};
    accessibleClasses.forEach((item) => {
      const assignmentIds = item.assignmentIds ?? [];
      map[item.classId] = assignmentIds
        .map((id) => school.assignments?.[id])
        .filter(Boolean);
    });
    return map;
  }, [accessibleClasses, school.assignments]);

  const threadKey = useMemo(
    () => buildThreadKey(selectedClassId, selectedAssignmentId),
    [selectedAssignmentId, selectedClassId]
  );

  const conversationCount = useMemo(
    () => Object.keys(loadAppData().studyAssistant?.conversationsByUser?.[userId] ?? {}).length,
    [messages, userId]
  );

  useEffect(() => {
    const data = loadAppData();
    const saved = data.studyAssistant?.conversationsByUser?.[userId]?.[threadKey] ?? [];
    setMessages(saved.length > 0 ? saved : defaultWelcomeMessage());
  }, [threadKey, userId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    updateAppData((current) => ({
      ...current,
      studyAssistant: {
        ...(current.studyAssistant ?? {}),
        selectedAssignmentByUser: {
          ...(current.studyAssistant?.selectedAssignmentByUser ?? {}),
          [userId]: {
            classId: selectedClassId,
            assignmentId: selectedAssignmentId
          }
        }
      }
    }));
  }, [selectedAssignmentId, selectedClassId, userId]);

  function persistConversation(nextMessages) {
    updateAppData((current) => ({
      ...current,
      studyAssistant: {
        ...(current.studyAssistant ?? {}),
        conversationsByUser: {
          ...(current.studyAssistant?.conversationsByUser ?? {}),
          [userId]: {
            ...(current.studyAssistant?.conversationsByUser?.[userId] ?? {}),
            [threadKey]: nextMessages
          }
        }
      }
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = input.trim();
    if ((!trimmed && attachments.length === 0) || loading) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      text: trimmed || "Please analyze my attachment.",
      timestamp: new Date().toISOString(),
      attachments: serializeAttachments(attachments)
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    persistConversation(nextMessages);
    setInput("");
    setUploadError("");
    setLoading(true);
    setLoadingLabel(getLoadingLabel(attachments, trimmed));

    try {
      const response = await generateTutorReply({
        message: trimmed,
        classId: selectedClassId || null,
        selectedAssignmentId: selectedAssignmentId || null,
        useClassContext,
        attachmentFiles: attachments.map((item) => item.file),
        school,
        user,
        recentHistory: nextMessages.slice(-8)
      });
      const assistantMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        text: response.text,
        timestamp: new Date().toISOString(),
        context: response.context,
        attachments: []
      };
      const finalMessages = [...nextMessages, assistantMessage];
      setMessages(finalMessages);
      persistConversation(finalMessages);
    } catch {
      const failMessage = {
        id: `assistant_error_${Date.now()}`,
        role: "assistant",
        text: "I had trouble analyzing that request. Please try again or upload a clearer image/crop.",
        timestamp: new Date().toISOString(),
        context: null,
        attachments: []
      };
      const finalMessages = [...nextMessages, failMessage];
      setMessages(finalMessages);
      persistConversation(finalMessages);
    } finally {
      attachments.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      setAttachments([]);
      setLoading(false);
      setLoadingLabel("Thinking through this with your context...");
    }
  }

  return (
    <section className="module-page-shell study-workspace-shell">
      <header className="module-hero module-hero-assistant">
        <div className="module-hero-copy">
          <p className="quest-kicker">AI study assistant</p>
          <h1>Work with a tutoring workspace, not a plain chat box.</h1>
          <p className="quest-lead">
            Ask for help with assignments, concepts, writing, and test prep. Upload worksheet photos, handwritten math,
            screenshots, or scanned files for multimodal tutoring.
          </p>
          <div className="badge-row">
            <ProgressBadge label="Saved Threads" value={conversationCount} />
            <ProgressBadge label="Classes Available" value={accessibleClasses.length} />
          </div>
        </div>
        <aside className="module-side-card">
          <p className="quest-side-kicker">Context controls</p>
          <div className="highlight-stack">
            <article className="highlight-card-dark">
              <h3>Class-aware help</h3>
              <p>Attach the right class and assignment so the tutor uses your actual coursework context.</p>
            </article>
            <article className="highlight-card-dark">
              <h3>Image understanding</h3>
              <p>Upload handwritten steps, worksheets, screenshots, and scanned files when text alone is not enough.</p>
            </article>
          </div>
        </aside>
      </header>

      <section className="study-workspace-grid">
        <aside className="quest-panel study-context-panel">
          <div className="panel-head">
            <div>
              <p className="quest-kicker">Context</p>
              <h2>Assignment source</h2>
            </div>
          </div>
          <AssignmentSelector
            classes={accessibleClasses}
            assignmentsByClass={assignmentsByClass}
            selectedClassId={selectedClassId}
            selectedAssignmentId={selectedAssignmentId}
            onClassChange={(value) => {
              setSelectedClassId(value);
              setSelectedAssignmentId("");
            }}
            onAssignmentChange={setSelectedAssignmentId}
          />
        </aside>

        <section className="chat-panel">
          <div className="chat-history" aria-live="polite">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                text={message.text}
                timestamp={message.timestamp}
                context={message.context}
                attachments={message.attachments ?? []}
              />
            ))}
            {loading && (
              <article className="chat-message chat-message-assistant chat-message-typing">
                <header className="chat-message-head">
                  <strong>NextStep Tutor</strong>
                </header>
                <p>{loadingLabel}</p>
              </article>
            )}
            <div ref={messageEndRef} />
          </div>
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            loading={loading}
            attachments={attachments}
            setAttachments={setAttachments}
            useClassContext={useClassContext}
            onToggleClassContext={setUseClassContext}
            uploadError={uploadError}
            setUploadError={setUploadError}
          />
        </section>
      </section>
    </section>
  );
}
