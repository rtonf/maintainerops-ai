import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  IconAlertTriangle,
  IconBellRinging,
  IconBrandGithub,
  IconChecks,
  IconChevronDown,
  IconChevronRight,
  IconCircleCheck,
  IconCopy,
  IconDatabase,
  IconFileCode,
  IconFilter,
  IconGitPullRequest,
  IconHome,
  IconInfoCircle,
  IconLockCheck,
  IconMenu2,
  IconRefresh,
  IconReportAnalytics,
  IconSearch,
  IconSettings,
  IconShieldCheck,
  IconTag,
  IconTestPipe,
  IconUpload
} from "@tabler/icons-react";
import "./styles.css";

type Severity = "critical" | "high" | "medium" | "low";
type Decision = "approve" | "approve_conditions" | "request_changes" | "block";

const workflows = [
  { label: "Overview", count: 0, icon: IconHome },
  { label: "PR Triage", count: 12, icon: IconGitPullRequest, active: true },
  { label: "Security Alerts", count: 8, icon: IconShieldCheck },
  { label: "Dependencies", count: 24, icon: IconDatabase },
  { label: "Policy Checks", count: 6, icon: IconLockCheck },
  { label: "Reports", count: 0, icon: IconReportAnalytics },
  { label: "Settings", count: 0, icon: IconSettings }
];

const repos = [
  { name: "acme/api-gateway", alerts: 12, prs: 3, warnings: 1, active: true },
  { name: "acme/auth-service", alerts: 7, prs: 1, warnings: 0 },
  { name: "acme/web-ui", alerts: 4, prs: 2, warnings: 0 },
  { name: "acme/worker", alerts: 3, prs: 0, warnings: 0 },
  { name: "acme/infra", alerts: 2, prs: 5, warnings: 0 },
  { name: "acme/shared-lib", alerts: 0, prs: 1, warnings: 0 },
  { name: "acme/cli", alerts: 2, prs: 1, warnings: 0 }
];

const files = [
  { path: "src/handlers/export.go", add: 78, del: 12, severity: "high", active: true },
  { path: "src/handlers/auth.go", add: 18, del: 3 },
  { path: "src/middleware/logging.go", add: 22, del: 0 },
  { path: "src/utils/path.go", add: 16, del: 4, severity: "high" },
  { path: "config/config.example.yaml", add: 6, del: 0 },
  { path: "config/config.yaml", add: 4, del: 4, severity: "medium" },
  { path: "tests/handlers/export_test.go", add: 0, del: 0 },
  { path: "tests/utils/path_test.go", add: 0, del: 0, severity: "medium" },
  { path: ".github/workflows/ci.yml", add: 24, del: 6 },
  { path: ".github/workflows/security-scan.yml", add: 8, del: 2 }
];

const findings = [
  {
    title: "Path Traversal",
    severity: "high" as Severity,
    score: 0.92,
    source: "src/handlers/export.go:47",
    status: "New",
    detail: "User-controlled path is used as the final write target. Restrict exports to the configured base directory."
  },
  {
    title: "Token Handling",
    severity: "high" as Severity,
    score: 0.88,
    source: "config/config.yaml:12",
    status: "New",
    detail: "Long-lived S3 token appears in configuration. Rotate and move credentials to CI secrets."
  },
  {
    title: "Dependency Advisory",
    severity: "medium" as Severity,
    score: 0.74,
    source: "github.com/aws/aws-sdk-go v1.44.0",
    status: "Existing",
    detail: "Dependency advisory remains open for the release branch. Verify upgrade compatibility before release."
  },
  {
    title: "Missing Tests",
    severity: "medium" as Severity,
    score: 0.61,
    source: "tests/handlers/export_test.go",
    status: "New",
    detail: "No test covers rejected traversal paths or safe base directory writes."
  },
  {
    title: "CI Check Failure",
    severity: "low" as Severity,
    score: 0.42,
    source: "gosec",
    status: "Existing",
    detail: "Static analysis still flags file permission handling. Confirm whether the new guard clears it."
  }
];

const alerts = [
  ["10:24 AM", "SAST", "High", "Path traversal via user-controlled path parameter", "src/handlers/export.go:47", "New"],
  ["10:22 AM", "Secret", "High", "AWS access key found in config", "config/config.yaml:12", "New"],
  ["10:18 AM", "Dependency", "Medium", "aws/aws-sdk-go v1.44.0 has 1 advisory", "go.mod", "Existing"],
  ["10:15 AM", "Tests", "Medium", "No tests added for new export logic", "tests/handlers/export_test.go", "New"],
  ["10:10 AM", "CI", "Low", "gosec: potential file permissions issue", ".github/workflows/ci.yml", "Existing"],
  ["10:05 AM", "CI", "Low", "unit-tests", ".github/workflows/ci.yml", "Passed"],
  ["10:05 AM", "CI", "High", "gosec", ".github/workflows/ci.yml", "Failed"]
];

const diffLines = [
  ["42", " ", "func exportHandler(w http.ResponseWriter, r *http.Request) {"],
  ["43", " ", "  user := r.Context().Value(ctxUser).(User)"],
  ["44", " ", "  if user == nil {"],
  ["45", " ", '    http.Error(w, "unauthorized", http.StatusUnauthorized)'],
  ["46", " ", "    return"],
  ["47", "+", '  exportPath := r.URL.Query().Get("path")'],
  ["48", "+", '  if exportPath == "" {'],
  ["49", "+", '    http.Error(w, "missing path", http.StatusBadRequest)'],
  ["50", "+", "    return"],
  ["51", " ", "  }"],
  ["52", "-", "  file, err := os.Create(exportPath)"],
  ["53", "-", "  if err != nil {"],
  ["54", "-", '    http.Error(w, "cannot create file", http.StatusInternalServerError)'],
  ["55", "-", "    return"],
  ["56", "-", "  }"],
  ["57", "+", '  baseDir := os.Getenv("EXPORT_BASE_DIR")'],
  ["58", "+", "  safePath := filepath.Join(baseDir, exportPath)"],
  ["59", "+", "  file, err := os.Create(safePath)"],
  ["60", "+", "  if err != nil {"],
  ["61", "+", '    http.Error(w, "cannot create file", http.StatusInternalServerError)'],
  ["62", "+", "    return"],
  ["63", "+", "  }"],
  ["64", " ", "  defer file.Close()"],
  ["65", " ", "}"]
];

function App() {
  const [activeTab, setActiveTab] = useState("Security Alerts");
  const [assessmentTab, setAssessmentTab] = useState("AI Assessment");
  const [threshold, setThreshold] = useState(65);
  const [dryRun, setDryRun] = useState(true);
  const [decision, setDecision] = useState<Decision>("approve_conditions");
  const [expanded, setExpanded] = useState("");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  const visibleFiles = useMemo(
    () => files.filter((file) => file.path.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  function saveDecision() {
    setToast(
      dryRun
        ? "Dry-run saved locally. No GitHub comment was posted."
        : "Decision queued for maintainer review before posting."
    );
    window.setTimeout(() => setToast(""), 3200);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand-row">
          <div className="brand-mark">
            <IconShieldCheck size={18} />
          </div>
          <strong>MaintainerOps AI</strong>
          <button className="icon-button" aria-label="Collapse navigation">
            <IconMenu2 size={18} />
          </button>
        </div>

        <section className="nav-section">
          <h2>Workflows</h2>
          {workflows.map((item) => {
            const Icon = item.icon;
            return (
              <button className={`nav-item ${item.active ? "active" : ""}`} key={item.label}>
                <Icon size={18} />
                <span>{item.label}</span>
                {item.count > 0 && <b>{item.count}</b>}
              </button>
            );
          })}
        </section>

        <section className="repo-section">
          <h2>Repositories</h2>
          <label className="search-box">
            <IconSearch size={17} />
            <input placeholder="Filter repositories" />
          </label>
          <div className="repo-list">
            {repos.map((repo) => (
              <button className={`repo-item ${repo.active ? "active" : ""}`} key={repo.name}>
                <IconBrandGithub size={17} />
                <span>{repo.name}</span>
                <small>
                  <span>{repo.alerts}</span>
                  <span>{repo.prs}</span>
                  <span>{repo.warnings}</span>
                </small>
                <IconChevronRight size={15} />
              </button>
            ))}
          </div>
        </section>

        <div className="profile-row">
          <div className="avatar">MK</div>
          <div>
            <strong>Maya Kapoor</strong>
            <span>Maintainer</span>
          </div>
          <IconChevronDown size={16} />
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="crumbs">
            <strong>Security Review Workbench</strong>
            <IconChevronRight size={16} />
            <span>PR #4821</span>
          </div>
          <div className="topbar-controls">
            <label className="select-label">
              <span>Model mode</span>
              <select defaultValue="gpt-4o-mini">
                <option value="gpt-4o-mini">GPT-4o mini</option>
                <option value="offline">Offline heuristic</option>
              </select>
            </label>
            <label className="switch-label">
              <span>Dry-run</span>
              <input type="checkbox" checked={dryRun} onChange={(event) => setDryRun(event.target.checked)} />
            </label>
            <label className="range-label">
              <span>Confidence threshold</span>
              <input
                type="range"
                min="20"
                max="95"
                value={threshold}
                onChange={(event) => setThreshold(Number(event.target.value))}
              />
              <b>{(threshold / 100).toFixed(2)}</b>
            </label>
            <button className="tag-button">
              <IconTag size={16} /> Labels <b>3</b>
            </button>
            <button className="icon-button" aria-label="Refresh">
              <IconRefresh size={18} />
            </button>
          </div>
        </header>

        <section className="pr-summary">
          <div>
            <span className="status-pill open">Open</span>
          </div>
          <div className="pr-title-block">
            <h1>
              PR #4821 <span>feat: add S3 export and audit logging</span>
            </h1>
            <p>
              acme/api-gateway <IconGitPullRequest size={14} /> feature/s3-export to main
            </p>
          </div>
          <div className="change-metrics">
            <span className="add">+324</span>
            <span className="del">-112</span>
          </div>
          <Metric label="Files changed" value="18" />
          <Metric label="Checks" value="3 / 5" />
          <Metric label="AI Risk Score" value="High" tone="danger" />
          <div className="maintainer-chip">
            <div className="avatar">MK</div>
            <span>Maya Kapoor</span>
            <IconChevronDown size={16} />
          </div>
        </section>

        <div className="content-grid">
          <section className="files-panel">
            <div className="tabs compact">
              <button className="active">
                Files changed <b>18</b>
              </button>
              <button>
                Risk hotspots <b>7</b>
              </button>
            </div>
            <div className="file-filter">
              <label className="search-box">
                <IconSearch size={16} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter files" />
              </label>
              <button className="icon-button" aria-label="Filter files">
                <IconFilter size={17} />
              </button>
            </div>
            <div className="file-list">
              {visibleFiles.map((file) => (
                <button className={`file-row ${file.active ? "active" : ""}`} key={file.path}>
                  <IconFileCode size={16} />
                  <span>{file.path}</span>
                  {file.severity && <SeverityIcon severity={file.severity as Severity} />}
                  <b className="add">+{file.add}</b>
                  <b className="del">-{file.del}</b>
                </button>
              ))}
            </div>
          </section>

          <section className="diff-panel">
            <div className="diff-toolbar">
              <div>
                <strong>src/handlers/export.go</strong>
                <SeverityIcon severity="high" />
                <span className="severity-badge high">High</span>
              </div>
              <div className="diff-actions">
                <span className="add">+78</span>
                <span className="del">-12</span>
                <button>Side-by-side</button>
                <button>Unified</button>
                <button className="icon-button" aria-label="Copy diff">
                  <IconCopy size={17} />
                </button>
              </div>
            </div>
            <div className="code-view" aria-label="Code diff">
              {diffLines.map(([line, marker, code]) => (
                <div
                  className={`code-line ${marker === "+" ? "added" : marker === "-" ? "removed" : ""}`}
                  key={`${line}-${code}`}
                >
                  <span className="line-no">{line}</span>
                  <span className="marker">{marker}</span>
                  <code>{code}</code>
                </div>
              ))}
            </div>
          </section>

          <aside className="assessment-panel">
            <div className="tabs">
              {["AI Assessment", "Metadata"].map((tab) => (
                <button
                  className={assessmentTab === tab ? "active" : ""}
                  onClick={() => setAssessmentTab(tab)}
                  key={tab}
                >
                  {tab}
                </button>
              ))}
            </div>
            {assessmentTab === "AI Assessment" ? (
              <>
                <section className="assessment-section">
                  <h2>
                    Summary <span className="severity-badge high">High risk</span>
                  </h2>
                  <p>
                    Path query controls disk writes. A token is read from env config, and traversal tests are missing.
                  </p>
                </section>

                <section className="assessment-section">
                  <h2>
                    Findings <b>{findings.length}</b>
                  </h2>
                  <div className="finding-list">
                    {findings.map((finding) => (
                      <button
                        className="finding-row"
                        onClick={() => setExpanded(expanded === finding.title ? "" : finding.title)}
                        key={finding.title}
                      >
                        <SeverityIcon severity={finding.severity} />
                        <span>
                          <strong>{finding.title}</strong>
                          <small>
                            {finding.severity} {finding.score.toFixed(2)} {finding.source}
                          </small>
                          {expanded === finding.title && <em>{finding.detail}</em>}
                        </span>
                        <b>{finding.status}</b>
                        <IconChevronDown size={16} />
                      </button>
                    ))}
                  </div>
                </section>

                <section className="assessment-section">
                  <h2>Recommended Actions</h2>
                  <ul className="action-list">
                    <li>
                      <IconCircleCheck size={15} /> Sanitize path; keep writes inside base dir.
                    </li>
                    <li>
                      <IconCircleCheck size={15} /> Reject user-controlled absolute paths.
                    </li>
                    <li>
                      <IconCircleCheck size={15} /> Rotate S3 token; use scoped secrets.
                    </li>
                    <li>
                      <IconCircleCheck size={15} /> Add path validation tests.
                    </li>
                  </ul>
                </section>

                <section className="confidence-row">
                  <strong>AI Confidence</strong>
                  <span>0.76</span>
                  <div>
                    <i style={{ width: "76%" }} />
                  </div>
                </section>

                <DecisionBox decision={decision} setDecision={setDecision} saveDecision={saveDecision} />
              </>
            ) : (
              <section className="assessment-section metadata">
                <h2>Metadata</h2>
                <dl>
                  <dt>Authorization</dt>
                  <dd>Maintainer-confirmed</dd>
                  <dt>Mode</dt>
                  <dd>{dryRun ? "Dry-run" : "Confirm before posting"}</dd>
                  <dt>Policy</dt>
                  <dd>Human-in-the-loop, no auto-merge</dd>
                  <dt>Audit ID</dt>
                  <dd>moai-2026-06-09-4821</dd>
                </dl>
              </section>
            )}
          </aside>

          <section className="bottom-panel">
            <div className="tabs">
              {["Security Alerts", "Dependency Alerts", "CI Checks", "Policy Checks", "Timeline"].map((tab) => (
                <button className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)} key={tab}>
                  {tab}{" "}
                  {tab !== "Timeline" && (
                    <b>
                      {tab === "Security Alerts" ? 8 : tab === "Dependency Alerts" ? 3 : tab === "CI Checks" ? 5 : 2}
                    </b>
                  )}
                </button>
              ))}
            </div>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Title</th>
                  <th>Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(([time, type, severity, title, source, status]) => (
                  <tr key={`${time}-${title}`}>
                    <td>{time}</td>
                    <td>
                      {typeIcon(type)} {type}
                    </td>
                    <td>
                      <span className={`severity-badge ${severity.toLowerCase()}`}>{severity}</span>
                    </td>
                    <td>{title}</td>
                    <td>{source}</td>
                    <td>
                      <span className={`status-pill ${status.toLowerCase()}`}>{status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "danger" }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong className={tone === "danger" ? "danger-text" : ""}>{value}</strong>
    </div>
  );
}

function SeverityIcon({ severity }: { severity: Severity }) {
  if (severity === "low") return <IconInfoCircle className="severity-icon low" size={16} />;
  if (severity === "medium") return <IconAlertTriangle className="severity-icon medium" size={16} />;
  return <IconShieldCheck className={`severity-icon ${severity}`} size={16} />;
}

function typeIcon(type: string) {
  if (type === "SAST") return <IconShieldCheck size={15} />;
  if (type === "Secret") return <IconLockCheck size={15} />;
  if (type === "Dependency") return <IconDatabase size={15} />;
  if (type === "Tests") return <IconTestPipe size={15} />;
  if (type === "CI") return <IconChecks size={15} />;
  return <IconBellRinging size={15} />;
}

function DecisionBox({
  decision,
  setDecision,
  saveDecision
}: {
  decision: Decision;
  setDecision: React.Dispatch<React.SetStateAction<Decision>>;
  saveDecision: () => void;
}) {
  const decisions: Array<[Decision, string]> = [
    ["approve", "Approve"],
    ["approve_conditions", "Approve with conditions"],
    ["request_changes", "Request changes"],
    ["block", "Block"]
  ];

  return (
    <section className="decision-box">
      <h2>Maintainer Decision</h2>
      {decisions.map(([value, label]) => (
        <label key={value}>
          <input type="radio" name="decision" checked={decision === value} onChange={() => setDecision(value)} />
          <span>{label}</span>
        </label>
      ))}
      <textarea placeholder="Add a note for the audit log..." />
      <button className="primary-button" onClick={saveDecision}>
        <IconUpload size={17} /> Save decision
      </button>
    </section>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
