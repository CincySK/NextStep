import { useMemo, useState } from "react";

const interestStyles = {
  Investigative: {
    summary: "You enjoy analyzing information, solving complex problems, and understanding how systems work.",
    traits: ["Analytical", "Curious", "Research-minded"]
  },
  Social: {
    summary: "You are motivated by helping people, mentoring, and making a practical human impact.",
    traits: ["Empathetic", "Supportive", "People-focused"]
  },
  Artistic: {
    summary: "You are energized by creative expression, communication, and building original ideas.",
    traits: ["Creative", "Expressive", "Imaginative"]
  },
  Realistic: {
    summary: "You prefer practical, hands-on environments where results are concrete and visible.",
    traits: ["Hands-on", "Action-oriented", "Practical"]
  },
  Enterprising: {
    summary: "You enjoy leading, influencing, and turning ideas into outcomes.",
    traits: ["Leadership", "Initiative", "Goal-driven"]
  },
  Conventional: {
    summary: "You value organization, reliability, and structured workflows that keep progress on track.",
    traits: ["Organized", "Detail-aware", "Structured"]
  }
};

function mapTokenToStyle(token) {
  const text = String(token ?? "").toLowerCase();
  if (/data|analysis|research|science|investigative|tech|system/.test(text)) return "Investigative";
  if (/help|care|patient|mentor|social|community|support/.test(text)) return "Social";
  if (/design|creative|media|story|brand|art/.test(text)) return "Artistic";
  if (/hands|build|practical|operations|realistic/.test(text)) return "Realistic";
  if (/lead|leadership|strategy|business|enterpris/.test(text)) return "Enterprising";
  if (/organized|process|structured|conventional|detail/.test(text)) return "Conventional";
  return null;
}

function buildInterestScores(report) {
  const scores = Object.fromEntries(Object.keys(interestStyles).map((style) => [style, 20]));
  const weightedSignals = [
    ...(report.dominantThemes ?? []).map((item) => ({ value: item, weight: 18 })),
    ...(report.valueThemes ?? []).map((item) => ({ value: item, weight: 10 })),
    ...(report.environmentThemes ?? []).map((item) => ({ value: item, weight: 10 })),
    { value: report.topDomain, weight: 15 },
    { value: report.narrative, weight: 8 }
  ];

  weightedSignals.forEach(({ value, weight }) => {
    const style = mapTokenToStyle(value);
    if (style) scores[style] += weight;
  });

  const ranked = Object.entries(scores)
    .map(([name, raw]) => ({ name, score: Math.min(100, raw) }))
    .sort((a, b) => b.score - a.score);

  return {
    ranked,
    top: ranked.slice(0, 3),
    supportive: ranked.slice(3, 6)
  };
}

function ProfileChart({ data }) {
  const max = Math.max(...data.map((item) => item.score), 1);
  return (
    <div className="interest-chart">
      {data.map((item) => (
        <div key={item.name} className="interest-bar-row">
          <div className="interest-bar-head">
            <span>{item.name}</span>
            <strong>{item.score}</strong>
          </div>
          <div className="interest-bar-track">
            <div className="interest-bar-fill" style={{ width: `${Math.round((item.score / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function buildThemeReason(themeName, report) {
  const signals = [
    ...(report.dominantThemes ?? []),
    ...(report.valueThemes ?? []),
    ...(report.environmentThemes ?? [])
  ];
  const matched = signals.filter((signal) => mapTokenToStyle(signal) === themeName).slice(0, 2);
  if (matched.length > 0) {
    return `Your answers signaled ${matched.join(" and ")}, which aligns with this theme.`;
  }
  return "This theme appears as a strong pattern across your priorities and work-style preferences.";
}

function ThemeCard({ theme, rank, report }) {
  const details = interestStyles[theme.name];
  return (
    <article className="theme-card">
      <p className="context-label">Top Theme #{rank}</p>
      <h4>{theme.name}</h4>
      <p>{details.summary}</p>
      <p>{buildThemeReason(theme.name, report)}</p>
      <div className="chip-row">
        {details.traits.map((trait) => (
          <span key={trait} className="signal-chip">{trait}</span>
        ))}
      </div>
    </article>
  );
}

function SupportiveCard({ theme }) {
  const details = interestStyles[theme.name];
  return (
    <article className="supportive-card">
      <h5>{theme.name}</h5>
      <p>{details.summary}</p>
    </article>
  );
}

function CareerPanel({ career, isBestFit, isCompared, onToggleCompare }) {
  const [expanded, setExpanded] = useState(isBestFit);
  return (
    <article className="career-panel">
      <div className="career-panel-head">
        <div>
          <div className="chip-row">
            {isBestFit && <span className="badge badge-default">Best Fit</span>}
            <span className="badge badge-default">Fit Score {career.confidence}%</span>
          </div>
          <h4>{career.title}</h4>
          <p className="career-subline">A pathway aligned with your strongest interests and work-style preferences.</p>
          <p>{career.whyItFits}</p>
        </div>
        <div className="career-panel-actions">
          <button className="secondary-btn" onClick={() => onToggleCompare(career.id)}>
            {isCompared ? "Remove Compare" : "Compare"}
          </button>
          <button className="secondary-btn" onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? "Show Less" : "Show Details"}
          </button>
        </div>
      </div>

      <div className="career-keyline">
        <p><strong>Work environment:</strong> {career.workEnvironment}</p>
        <p><strong>Education:</strong> {career.educationPath}</p>
      </div>

      {expanded && (
        <div className="career-detail-grid">
          <article className="mini-card">
            <h5>What People Do</h5>
            <ul className="list-clean">
              {career.whatPeopleDo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="mini-card">
            <h5>Compensation + Outlook</h5>
            <p><strong>Salary note:</strong> {career.salaryNote}</p>
            <p><strong>Growth:</strong> {career.outlookNote}</p>
          </article>
          <article className="mini-card">
            <h5>Related Majors</h5>
            <div className="chip-row">
              {career.relatedMajors.map((major) => (
                <span key={major} className="signal-chip">{major}</span>
              ))}
            </div>
            <p className="feedback">{career.firstStep}</p>
          </article>
        </div>
      )}
    </article>
  );
}

export default function CareerReport({
  report,
  compareCards,
  compareSelection,
  onToggleCompare,
  onRetake,
  onGoDashboard,
  onExploreCollege
}) {
  const profile = useMemo(() => buildInterestScores(report), [report]);

  return (
    <section className="career-report">
      <header className="career-report-hero">
        <p className="quiz-flow-label">Personalized Career Report</p>
        <h2>Your Career Exploration Report</h2>
        <p>
          Based on your interests, strengths, and preferences, this report highlights career paths worth exploring next.
        </p>
        <p className="career-hero-note">
          You are not choosing your entire future today. You are identifying promising directions to explore with more confidence.
        </p>
        <p className="quiz-meta">Saved {new Date(report.generatedAt).toLocaleDateString()}</p>
      </header>

      <section className="career-report-section">
        <div className="section-header">
          <div>
            <h3>Your Interest Profile</h3>
            <p className="intro-copy">A ranked view of your strongest work-interest themes, based on your full response pattern.</p>
          </div>
        </div>
        <ProfileChart data={profile.ranked} />
      </section>

      <section className="career-report-section surface-alt">
        <h3>Top Match Themes</h3>
        <div className="theme-grid">
          {profile.top.map((theme, idx) => (
            <ThemeCard key={theme.name} theme={theme} rank={idx + 1} report={report} />
          ))}
        </div>
      </section>

      <section className="career-report-section">
        <h3>Supportive Areas You May Also Enjoy</h3>
        <p className="intro-copy">These secondary strengths can complement your top themes and expand your options.</p>
        <div className="supportive-grid">
          {profile.supportive.map((theme) => (
            <SupportiveCard key={theme.name} theme={theme} />
          ))}
        </div>
      </section>

      <section className="career-report-section">
        <h3>How Your Interest Style Works</h3>
        <p>
          Career fit is usually a blend, not a single label. Your strongest themes guide direction, while supportive
          themes show adjacent environments where you may also thrive.
        </p>
        <div className="chip-row">
          {profile.top.map((item) => (
            <span key={item.name} className="signal-chip">{item.name}</span>
          ))}
          <span className="signal-chip">+</span>
          {profile.supportive.slice(0, 2).map((item) => (
            <span key={item.name} className="signal-chip">{item.name}</span>
          ))}
        </div>
      </section>

      <section className="career-report-section surface-alt">
        <h3>Potential Occupations</h3>
        <p className="intro-copy">
          These career profiles align with your answer patterns, priorities, and preferred work environments.
        </p>
        <div className="career-panel-list">
          {report.researchCards.map((career, idx) => (
            <CareerPanel
              key={career.id}
              career={career}
              isBestFit={idx === 0}
              isCompared={compareSelection.includes(career.id)}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      </section>

      <section className="career-report-section">
        <h3>Why These Careers Fit You</h3>
        <p>{report.narrative}</p>
        <p>
          In short, your answers point toward a blend of strengths that match these pathways more closely than generic alternatives.
        </p>
        {report.tradeoffs?.length > 0 && (
          <ul className="list-clean">
            {report.tradeoffs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="career-report-section surface-alt">
        <h3>Questions To Ask As You Explore</h3>
        <div className="reflection-grid">
          {(report.counselorQuestions ?? []).map((question) => (
            <article key={question} className="mini-card">
              <p>{question}</p>
            </article>
          ))}
          <article className="mini-card">
            <p>What environment fits me best: people, ideas, systems, or hands-on work?</p>
          </article>
          <article className="mini-card">
            <p>How do I want to balance salary, impact, flexibility, and education time?</p>
          </article>
        </div>
      </section>

      <section className="career-report-section">
        <h3>Next Steps Action Plan</h3>
        <div className="next-step-grid">
          {(report.nextSteps ?? []).map((step) => (
            <article key={step} className="mini-card">
              <p>{step}</p>
            </article>
          ))}
        </div>
        <div className="quiz-nav">
          <button className="secondary-btn desktop-only-cta" onClick={onRetake}>Retake Quiz</button>
          <button className="secondary-btn desktop-only-cta" onClick={onExploreCollege}>Explore College Match</button>
          <button className="primary-btn desktop-only-cta" onClick={onGoDashboard}>Save and Go to Dashboard</button>
        </div>

        <div className="mobile-sticky-report-cta">
          <button className="secondary-btn" onClick={onRetake}>Retake Quiz</button>
          <button className="secondary-btn" onClick={onExploreCollege}>Explore College Match</button>
          <button className="primary-btn" onClick={onGoDashboard}>Save and Go to Dashboard</button>
        </div>
      </section>

      {compareCards.length === 2 && (
        <section className="career-report-section surface-alt">
          <h3>Compare Your Selected Careers</h3>
          <div className="compare-grid">
            {compareCards.map((career) => (
              <article key={career.id} className="mini-card">
                <h4>{career.title}</h4>
                <p><strong>Environment:</strong> {career.workEnvironment}</p>
                <p><strong>Education:</strong> {career.educationPath}</p>
                <p><strong>Salary note:</strong> {career.salaryNote}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {report.excludedRecommendations?.length > 0 && (
        <section className="career-report-section">
          <h3>Why Some Careers Were Not Prioritized</h3>
          <ul className="list-clean">
            {report.excludedRecommendations.slice(0, 4).map((item) => (
              <li key={item.career}><strong>{item.career}:</strong> {item.reason}</li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
