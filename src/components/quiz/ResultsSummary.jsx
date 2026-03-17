export default function ResultsSummary({ result, onStartOver, onGoDashboard, dashboardLabel = "Go to Dashboard" }) {
  return (
    <section className="quiz-results-card quiz-summary-shell">
      <header className="quiz-summary-hero">
        <div>
          <p className="quiz-flow-label">Personalized Summary</p>
          <h2>{result.title}</h2>
          <p>{result.whyItFits}</p>
        </div>
        <div className="quiz-summary-side">
          <span className="status-chip status-complete">Summary ready</span>
          <p>Your results are saved and can shape what appears next across NextStep.</p>
        </div>
      </header>
      {result.recommendationExplanation && (
        <p className="feedback">{result.recommendationExplanation}</p>
      )}

      <article className="result-block result-block-elevated">
        <h3>Top Match Areas</h3>
        <ul className="list-clean">
          {result.topMatches.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      {result.possibleMajors && (
        <article className="result-block result-block-elevated">
          <h3>Possible Majors</h3>
          <ul className="list-clean">
            {result.possibleMajors.map((major) => (
              <li key={major}>{major}</li>
            ))}
          </ul>
        </article>
      )}

      {result.sampleCollegeNotes && (
        <article className="result-block result-block-elevated">
          <p className="mini-label">Your top priority: {result.whatMattersMost}</p>
          <h3>Sample College Fits</h3>
          <div className="recommend-grid">
            {result.sampleCollegeNotes.map((item) => (
              <article key={item.name} className="mini-card">
                <h4>{item.name}</h4>
                <p>{item.reason}</p>
              </article>
            ))}
          </div>
        </article>
      )}

      {result.supportingSignals && (
        <article className="result-block result-block-elevated">
          <h3>Strongest Signals From Your Answers</h3>
          <div className="chip-row">
            {result.supportingSignals.map((signal) => (
              <span key={signal} className="signal-chip">{signal}</span>
            ))}
          </div>
        </article>
      )}

      <article className="result-block result-block-elevated">
        <h3>Recommended Next Steps</h3>
        <ul className="list-clean">
          {result.nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </article>

      <div className="quiz-nav">
        <button className="secondary-btn" onClick={onStartOver}>
          Start New Quiz
        </button>
        {onGoDashboard && (
          <button className="primary-btn" onClick={onGoDashboard}>
            {dashboardLabel}
          </button>
        )}
      </div>
    </section>
  );
}
