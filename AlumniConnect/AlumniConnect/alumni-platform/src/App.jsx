import { useState, useEffect } from "react";
import {
  getAlumni, addAlumni,
  getEvents, registerForEvent,
  getJobs,
  loginUser, registerUser,
} from "./api";

const avatarColors = ["#4F86C6","#E8845A","#5CB87A","#A675D4","#E8A838","#5BBFB5","#E86A6A"];
function getColor(name = "") {
  let hash = 0;
  for (let c of name) hash = (hash + c.charCodeAt(0)) % avatarColors.length;
  return avatarColors[hash];
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #F8F6F1; color: #1A1A2E; }
  :root {
    --cream: #F8F6F1; --navy: #1A1A2E; --accent: #C4773B;
    --accent-light: #F5E6D3; --green: #3B7A57; --border: #E2DDD5;
    --card: #FFFFFF; --text-muted: #7A7467; --red: #C0392B;
  }
  html, body, #root { width: 100%; min-height: 100vh; }
  .app { min-height: 100vh; background: var(--cream); width: 100%; }

  /* HEADER */
  .header { background: var(--navy); color: white; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 64px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 12px rgba(26,26,46,0.15); flex-wrap: wrap; gap: 8px; width: 100%; }
  .header-logo { font-family: 'DM Serif Display', serif; font-size: 1.4rem; display: flex; align-items: center; gap: 10px; }
  .logo-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
  .header-nav { display: flex; gap: 4px; flex-wrap: wrap; }
  .nav-btn { background: transparent; border: none; color: rgba(255,255,255,0.65); padding: 6px 14px; border-radius: 6px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; transition: all 0.2s; }
  .nav-btn:hover { color: white; background: rgba(255,255,255,0.1); }
  .nav-btn.active { color: white; background: var(--accent); }
  .header-user { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.8); font-size: 0.85rem; }
  .logout-btn { background: rgba(255,255,255,0.1); border: none; color: white; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; transition: background 0.2s; }
  .logout-btn:hover { background: var(--red); }

  /* HERO */
  .hero { background: var(--navy); color: white; padding: 4rem 2rem 5rem; text-align: center; position: relative; overflow: hidden; width: 100%; }
  .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 50%, rgba(196,119,59,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(91,191,181,0.1) 0%, transparent 50%); }
  .hero-content { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; }
  .hero h1 { font-family: 'DM Serif Display', serif; font-size: clamp(2rem, 5vw, 3rem); line-height: 1.1; margin-bottom: 1rem; }
  .hero h1 span { color: var(--accent); font-style: italic; }
  .hero p { color: rgba(255,255,255,0.65); font-size: 1.05rem; margin-bottom: 2rem; }
  .hero-stats { display: flex; gap: 2.5rem; justify-content: center; flex-wrap: wrap; }
  .stat { text-align: center; }
  .stat-num { font-family: 'DM Serif Display', serif; font-size: 2rem; color: var(--accent); display: block; }
  .stat-label { font-size: 0.8rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; }

  /* MAIN */
  .main { max-width: 100%; width: 100%; margin: 0 auto; padding: 2.5rem 3rem; }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
  .section-title { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: var(--navy); }
  .section-badge { background: var(--accent-light); color: var(--accent); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }

  /* SEARCH */
  .search-bar { display: flex; gap: 12px; margin-bottom: 2rem; flex-wrap: wrap; }
  .search-input { flex: 1; min-width: 220px; padding: 10px 16px; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; background: white; outline: none; transition: border-color 0.2s; }
  .search-input:focus { border-color: var(--accent); }
  .filter-select { padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; background: white; cursor: pointer; outline: none; color: var(--navy); }

  /* ALUMNI GRID */
  .alumni-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; width: 100%; }
  .alumni-card { background: var(--card); border: 1.5px solid var(--border); border-radius: 16px; padding: 1.5rem; transition: all 0.25s; cursor: pointer; position: relative; overflow: hidden; }
  .alumni-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--accent); transform: scaleX(0); transition: transform 0.25s; transform-origin: left; }
  .alumni-card:hover { box-shadow: 0 8px 28px rgba(26,26,46,0.1); transform: translateY(-2px); }
  .alumni-card:hover::before { transform: scaleX(1); }
  .card-top { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }
  .avatar { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; color: white; flex-shrink: 0; }
  .card-name { font-weight: 600; font-size: 1rem; color: var(--navy); }
  .card-batch { font-size: 0.78rem; color: var(--text-muted); }
  .card-role { font-size: 0.875rem; color: var(--navy); margin-bottom: 4px; }
  .card-company { font-size: 0.825rem; color: var(--accent); font-weight: 600; }
  .card-location { font-size: 0.8rem; color: var(--text-muted); margin-top: 4px; }
  .card-skills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 1rem; }
  .skill-tag { background: var(--accent-light); color: var(--accent); padding: 2px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
  .mentor-badge { background: #E6F4EC; color: var(--green); padding: 2px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; margin-left: auto; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(26,26,46,0.5); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  .modal { background: white; border-radius: 20px; padding: 2rem; max-width: 480px; width: 100%; position: relative; animation: slideUp 0.25s ease; max-height: 90vh; overflow-y: auto; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  .modal-close { position: absolute; top: 1.25rem; right: 1.25rem; background: var(--cream); border: none; border-radius: 8px; width: 32px; height: 32px; cursor: pointer; font-size: 1.1rem; color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
  .modal-close:hover { background: var(--border); }
  .modal-avatar { width: 72px; height: 72px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.4rem; color: white; margin-bottom: 1rem; }
  .modal-name { font-family: 'DM Serif Display', serif; font-size: 1.6rem; margin-bottom: 4px; }
  .modal-role { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; }
  .modal-detail { display: flex; gap: 8px; margin-bottom: 8px; font-size: 0.875rem; color: var(--navy); }
  .modal-label { color: var(--text-muted); min-width: 80px; }
  .modal-actions { display: flex; gap: 10px; margin-top: 1.5rem; }
  .btn-primary { flex: 1; padding: 10px; border-radius: 10px; background: var(--navy); color: white; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.875rem; transition: background 0.2s; }
  .btn-primary:hover { background: var(--accent); }
  .btn-secondary { flex: 1; padding: 10px; border-radius: 10px; background: transparent; color: var(--navy); border: 1.5px solid var(--border); cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.875rem; transition: all 0.2s; }
  .btn-secondary:hover { border-color: var(--navy); }

  /* EVENTS */
  .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; width: 100%; }
  .event-card { background: white; border: 1.5px solid var(--border); border-radius: 16px; padding: 1.5rem; transition: all 0.25s; }
  .event-card:hover { box-shadow: 0 8px 24px rgba(26,26,46,0.08); transform: translateY(-2px); }
  .event-type { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.75rem; background: var(--accent-light); color: var(--accent); }
  .event-title { font-weight: 700; font-size: 1rem; margin-bottom: 8px; color: var(--navy); }
  .event-meta { font-size: 0.825rem; color: var(--text-muted); margin-bottom: 4px; }
  .event-attendees { font-size: 0.8rem; color: var(--green); font-weight: 600; margin-top: 10px; }
  .register-btn { width: 100%; margin-top: 1rem; padding: 9px; background: var(--navy); color: white; border: none; border-radius: 9px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.85rem; transition: background 0.2s; }
  .register-btn:hover { background: var(--accent); }
  .register-btn.registered { background: var(--green); }

  /* JOBS */
  .jobs-list { display: flex; flex-direction: column; gap: 1rem; }
  .job-card { background: white; border: 1.5px solid var(--border); border-radius: 14px; padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; transition: all 0.2s; flex-wrap: wrap; }
  .job-card:hover { box-shadow: 0 6px 20px rgba(26,26,46,0.07); border-color: var(--accent); }
  .job-title { font-weight: 700; font-size: 0.95rem; color: var(--navy); }
  .job-company { font-size: 0.875rem; color: var(--accent); font-weight: 600; }
  .job-meta { font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }
  .job-type { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; background: #E6F4EC; color: var(--green); }
  .job-type.internship { background: #EEE6FA; color: #7B4BC7; }
  .apply-btn { padding: 8px 20px; background: var(--navy); color: white; border: none; border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.825rem; transition: background 0.2s; white-space: nowrap; }
  .apply-btn:hover { background: var(--accent); }

  /* FORM */
  .register-form { background: white; border: 1.5px solid var(--border); border-radius: 20px; padding: 2.5rem; max-width: 600px; margin: 0 auto; }
  .form-title { font-family: 'DM Serif Display', serif; font-size: 1.75rem; margin-bottom: 0.5rem; color: var(--navy); }
  .form-subtitle { color: var(--text-muted); margin-bottom: 2rem; font-size: 0.9rem; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group.full { grid-column: 1 / -1; }
  .form-label { font-size: 0.825rem; font-weight: 600; color: var(--navy); }
  .form-input, .form-select { padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; outline: none; background: var(--cream); transition: border-color 0.2s; color: var(--navy); }
  .form-input:focus, .form-select:focus { border-color: var(--accent); background: white; }
  .submit-btn { width: 100%; padding: 12px; background: var(--navy); color: white; border: none; border-radius: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 1rem; margin-top: 1.5rem; transition: background 0.2s; }
  .submit-btn:hover { background: var(--accent); }
  .submit-btn:disabled { background: #aaa; cursor: not-allowed; }

  /* AUTH */
  .auth-wrap { max-width: 420px; margin: 3rem auto; background: white; border: 1.5px solid var(--border); border-radius: 20px; padding: 2.5rem; }
  .auth-tabs { display: flex; gap: 0; margin-bottom: 2rem; border: 1.5px solid var(--border); border-radius: 10px; overflow: hidden; }
  .auth-tab { flex: 1; padding: 10px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; color: var(--text-muted); }
  .auth-tab.active { background: var(--navy); color: white; }

  /* ALERTS */
  .alert { padding: 10px 16px; border-radius: 10px; font-size: 0.875rem; margin-bottom: 1rem; }
  .alert-error { background: #fdecea; color: var(--red); border: 1px solid #f5c6cb; }
  .alert-success { background: #E6F4EC; color: var(--green); }

  /* DASHBOARD */
  .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2.5rem; }
  .dash-card { background: white; border: 1.5px solid var(--border); border-radius: 14px; padding: 1.5rem; text-align: center; }
  .dash-num { font-family: 'DM Serif Display', serif; font-size: 2.2rem; color: var(--accent); display: block; margin-bottom: 4px; }
  .dash-label { font-size: 0.825rem; color: var(--text-muted); font-weight: 500; }

  /* MISC */
  .success-msg { text-align: center; padding: 2rem; background: #E6F4EC; border-radius: 16px; color: var(--green); }
  .success-msg h3 { font-family: 'DM Serif Display', serif; font-size: 1.5rem; margin-bottom: 0.5rem; }
  .empty { text-align: center; padding: 3rem; color: var(--text-muted); font-size: 1rem; }
  .loading { text-align: center; padding: 3rem; color: var(--text-muted); font-size: 1rem; }
  .spinner { display: inline-block; width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ── LOADING COMPONENT ─────────────────────────────
function Loading() {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <div>Loading...</div>
    </div>
  );
}

// ── AUTH PAGE ─────────────────────────────────────
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) return setError("Please fill all fields.");
    if (tab === "register" && !form.name) return setError("Please enter your name.");
    setLoading(true);
    try {
      const data = tab === "login"
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser({ name: form.name, email: form.email, password: form.password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email, role: data.role }));
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="auth-wrap">
        <div className="form-title" style={{ marginBottom: "0.5rem" }}>
          {tab === "login" ? "Welcome Back 👋" : "Join AlumniConnect 🎓"}
        </div>
        <div className="form-subtitle">
          {tab === "login" ? "Login to your account" : "Create your alumni account"}
        </div>
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); }}>Login</button>
          <button className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setError(""); }}>Register</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {tab === "register" && (
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Please wait..." : tab === "login" ? "Login →" : "Create Account →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────
export default function AlumniPlatform() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [activeTab, setActiveTab] = useState("directory");

  // Data states
  const [alumni, setAlumni]   = useState([]);
  const [events, setEvents]   = useState([]);
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Directory filters
  const [search, setSearch]           = useState("");
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterBatch, setFilterBatch]   = useState("All");
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  // Register form
  const [form, setForm]       = useState({ name:"", batch:"", branch:"", company:"", role:"", location:"", email:"", skills:"", mentoring:"No" });
  const [submitted, setSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError]     = useState("");

  // Registered events
  const [registeredEvents, setRegisteredEvents] = useState({});

  // ── FETCH DATA ──────────────────────────────────
  useEffect(() => {
    if (activeTab === "directory") fetchAlumni();
    if (activeTab === "events")    fetchEvents();
    if (activeTab === "jobs")      fetchJobs();
    if (activeTab === "dashboard") { fetchAlumni(); fetchEvents(); fetchJobs(); }
  }, [activeTab]);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      let params = "";
      const q = [];
      if (search)                    q.push(`search=${search}`);
      if (filterBranch !== "All")    q.push(`branch=${filterBranch}`);
      if (filterBatch  !== "All")    q.push(`batch=${filterBatch}`);
      if (q.length)                  params = "?" + q.join("&");
      const data = await getAlumni(params);
      setAlumni(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  // Search re-fetch
  useEffect(() => {
    if (activeTab === "directory") fetchAlumni();
  }, [search, filterBranch, filterBatch]);

  // ── HANDLERS ────────────────────────────────────
  const handleLogin = (data) => setUser({ name: data.name, email: data.email, role: data.role });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setActiveTab("directory");
  };

  const handleRegisterEvent = async (eventId) => {
    if (!user) return alert("Please login to register for events.");
    try {
      await registerForEvent(eventId);
      setRegisteredEvents(r => ({ ...r, [eventId]: true }));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmitAlumni = async () => {
    setFormError("");
    if (!form.name || !form.email || !form.batch) return setFormError("Please fill required fields.");
    setFormLoading(true);
    try {
      await addAlumni({
        ...form,
        skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
        mentoring: form.mentoring === "Yes",
      });
      setSubmitted(true);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const branches = ["All", ...new Set(alumni.map(a => a.branch))];
  const batches  = ["All", ...new Set(alumni.map(a => a.batch))].sort();

  // ── SHOW AUTH PAGE IF NOT LOGGED IN (for join tab) ──
  if (!user && activeTab === "register") {
    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <header className="header">
            <div className="header-logo"><div className="logo-dot" />AlumniConnect</div>
            <nav className="header-nav">
              {[["directory","Directory"],["events","Events"],["jobs","Jobs"],["register","Join"],["dashboard","Dashboard"]].map(([key, label]) => (
                <button key={key} className={`nav-btn ${activeTab===key?"active":""}`} onClick={() => setActiveTab(key)}>{label}</button>
              ))}
            </nav>
          </header>
          <AuthPage onLogin={handleLogin} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* HEADER */}
        <header className="header">
          <div className="header-logo"><div className="logo-dot" />AlumniConnect</div>
          <nav className="header-nav">
            {[["directory","Directory"],["events","Events"],["jobs","Jobs"],["register","Join"],["dashboard","Dashboard"]].map(([key, label]) => (
              <button key={key} className={`nav-btn ${activeTab===key?"active":""}`} onClick={() => { setActiveTab(key); setSubmitted(false); setFormError(""); }}>{label}</button>
            ))}
          </nav>
          {user ? (
            <div className="header-user">
              👤 {user.name}
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="nav-btn" onClick={() => setActiveTab("register")} style={{background:"var(--accent)", color:"white"}}>Login</button>
          )}
        </header>

        {/* HERO */}
        {activeTab === "directory" && (
          <div className="hero">
            <div className="hero-content">
              <h1>Connect with <span>Alumni</span> who've walked your path</h1>
              <p>Build meaningful connections, find mentors, and grow your professional network</p>
              <div className="hero-stats">
                <div className="stat"><span className="stat-num">{alumni.length}+</span><span className="stat-label">Alumni</span></div>
                <div className="stat"><span className="stat-num">{alumni.filter(a=>a.mentoring).length}</span><span className="stat-label">Mentors</span></div>
                <div className="stat"><span className="stat-num">{events.length}</span><span className="stat-label">Events</span></div>
                <div className="stat"><span className="stat-num">{jobs.length}</span><span className="stat-label">Openings</span></div>
              </div>
            </div>
          </div>
        )}

        <main className="main">

          {/* DIRECTORY */}
          {activeTab === "directory" && (
            <>
              <div className="section-header">
                <h2 className="section-title">Alumni Directory</h2>
                <span className="section-badge">{alumni.length} found</span>
              </div>
              <div className="search-bar">
                <input className="search-input" placeholder="Search by name, company, role…" value={search} onChange={e => setSearch(e.target.value)} />
                <select className="filter-select" value={filterBranch} onChange={e => setFilterBranch(e.target.value)}>
                  {branches.map(b => <option key={b}>{b}</option>)}
                </select>
                <select className="filter-select" value={filterBatch} onChange={e => setFilterBatch(e.target.value)}>
                  {batches.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              {loading ? <Loading /> : alumni.length === 0 ? <div className="empty">No alumni found.</div> : (
                <div className="alumni-grid">
                  {alumni.map(a => (
                    <div key={a._id} className="alumni-card" onClick={() => setSelectedAlumni(a)}>
                      <div className="card-top">
                        <div className="avatar" style={{ background: getColor(a.name) }}>{a.avatar || a.name?.slice(0,2).toUpperCase()}</div>
                        <div>
                          <div className="card-name">{a.name}</div>
                          <div className="card-batch">Batch of {a.batch} · {a.branch}</div>
                        </div>
                        {a.mentoring && <span className="mentor-badge">Mentor</span>}
                      </div>
                      <div className="card-role">{a.role}</div>
                      <div className="card-company">{a.company}</div>
                      <div className="card-location">📍 {a.location}</div>
                      <div className="card-skills">
                        {a.skills?.slice(0,3).map(s => <span key={s} className="skill-tag">{s}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* EVENTS */}
          {activeTab === "events" && (
            <>
              <div className="section-header">
                <h2 className="section-title">Upcoming Events</h2>
                <span className="section-badge">{events.length} events</span>
              </div>
              {loading ? <Loading /> : events.length === 0 ? <div className="empty">No events yet.</div> : (
                <div className="events-grid">
                  {events.map(e => (
                    <div key={e._id} className="event-card">
                      <span className="event-type">{e.type}</span>
                      <div className="event-title">{e.title}</div>
                      <div className="event-meta">📅 {e.date}</div>
                      <div className="event-meta">📍 {e.location}</div>
                      <div className="event-attendees">✓ {e.attendees?.length || 0} registered</div>
                      <button
                        className={`register-btn ${registeredEvents[e._id] ? "registered" : ""}`}
                        onClick={() => handleRegisterEvent(e._id)}
                      >
                        {registeredEvents[e._id] ? "✓ Registered!" : "Register Now"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* JOBS */}
          {activeTab === "jobs" && (
            <>
              <div className="section-header">
                <h2 className="section-title">Job & Internship Board</h2>
                <span className="section-badge">{jobs.length} openings</span>
              </div>
              {loading ? <Loading /> : jobs.length === 0 ? <div className="empty">No jobs posted yet.</div> : (
                <div className="jobs-list">
                  {jobs.map(j => (
                    <div key={j._id} className="job-card">
                      <div style={{flex:1}}>
                        <div className="job-title">{j.title}</div>
                        <div className="job-company">{j.company}</div>
                        <div className="job-meta">📍 {j.location} · Posted by {j.postedBy?.name || "Alumni"}</div>
                      </div>
                      <span className={`job-type ${j.type==="Internship"?"internship":""}`}>{j.type}</span>
                      <button className="apply-btn">Apply Now</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* JOIN / REGISTER ALUMNI */}
          {activeTab === "register" && user && (
            submitted ? (
              <div className="success-msg">
                <div style={{fontSize:"3rem", marginBottom:"1rem"}}>🎉</div>
                <h3>Profile Added Successfully!</h3>
                <p>Your alumni profile is now live in the directory.</p>
                <button className="btn-primary" style={{maxWidth:200, margin:"1.5rem auto 0", display:"block"}}
                  onClick={() => { setActiveTab("directory"); setSubmitted(false); }}>
                  View Directory
                </button>
              </div>
            ) : (
              <div className="register-form">
                <div className="form-title">Add Your Profile</div>
                <div className="form-subtitle">Join the alumni network — your profile will appear in the directory</div>
                {formError && <div className="alert alert-error">{formError}</div>}
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="you@email.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Batch Year *</label>
                    <input className="form-input" value={form.batch} onChange={e => setForm({...form, batch:e.target.value})} placeholder="e.g. 2022" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Branch</label>
                    <select className="form-select" value={form.branch} onChange={e => setForm({...form, branch:e.target.value})}>
                      <option value="">Select</option>
                      {["Computer Science","Electronics","Mechanical","Civil","Chemical"].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current Company</label>
                    <input className="form-input" value={form.company} onChange={e => setForm({...form, company:e.target.value})} placeholder="e.g. Google" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role / Designation</label>
                    <input className="form-input" value={form.role} onChange={e => setForm({...form, role:e.target.value})} placeholder="e.g. Software Engineer" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input className="form-input" value={form.location} onChange={e => setForm({...form, location:e.target.value})} placeholder="City, Country" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Open to Mentor?</label>
                    <select className="form-select" value={form.mentoring} onChange={e => setForm({...form, mentoring:e.target.value})}>
                      <option>No</option><option>Yes</option>
                    </select>
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Skills (comma separated)</label>
                    <input className="form-input" value={form.skills} onChange={e => setForm({...form, skills:e.target.value})} placeholder="e.g. React, Python, Machine Learning" />
                  </div>
                </div>
                <button className="submit-btn" onClick={handleSubmitAlumni} disabled={formLoading}>
                  {formLoading ? "Saving..." : "Add My Profile →"}
                </button>
              </div>
            )
          )}

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <div className="section-header"><h2 className="section-title">Network Overview</h2></div>
              <div className="dashboard-grid">
                <div className="dash-card"><span className="dash-num">{alumni.length}</span><span className="dash-label">Total Alumni</span></div>
                <div className="dash-card"><span className="dash-num">{alumni.filter(a=>a.mentoring).length}</span><span className="dash-label">Active Mentors</span></div>
                <div className="dash-card"><span className="dash-num">{[...new Set(alumni.map(a=>a.company))].filter(Boolean).length}</span><span className="dash-label">Companies</span></div>
                <div className="dash-card"><span className="dash-num">{events.length}</span><span className="dash-label">Upcoming Events</span></div>
                <div className="dash-card"><span className="dash-num">{jobs.length}</span><span className="dash-label">Job Openings</span></div>
                <div className="dash-card"><span className="dash-num">{[...new Set(alumni.map(a=>a.location))].filter(Boolean).length}</span><span className="dash-label">Cities</span></div>
              </div>
              {user && (
                <div className="alert alert-success" style={{borderRadius:12, padding:"1rem 1.5rem"}}>
                  👋 Logged in as <strong>{user.name}</strong> ({user.role})
                </div>
              )}
            </>
          )}

        </main>

        {/* ALUMNI MODAL */}
        {selectedAlumni && (
          <div className="modal-overlay" onClick={() => setSelectedAlumni(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedAlumni(null)}>✕</button>
              <div className="modal-avatar" style={{background: getColor(selectedAlumni.name)}}>
                {selectedAlumni.avatar || selectedAlumni.name?.slice(0,2).toUpperCase()}
              </div>
              <div className="modal-name">{selectedAlumni.name}</div>
              <div className="modal-role">{selectedAlumni.role} at {selectedAlumni.company}</div>
              <div className="modal-detail"><span className="modal-label">Batch</span> {selectedAlumni.batch}</div>
              <div className="modal-detail"><span className="modal-label">Branch</span> {selectedAlumni.branch}</div>
              <div className="modal-detail"><span className="modal-label">Location</span> 📍 {selectedAlumni.location}</div>
              <div className="modal-detail"><span className="modal-label">Email</span> {selectedAlumni.email}</div>
              <div className="modal-detail"><span className="modal-label">Mentor</span> {selectedAlumni.mentoring ? "✅ Available" : "❌ Not available"}</div>
              <div className="card-skills" style={{marginTop:"1rem"}}>
                {selectedAlumni.skills?.map(s => <span key={s} className="skill-tag">{s}</span>)}
              </div>
              <div className="modal-actions">
                <button className="btn-primary" onClick={() => window.location.href=`mailto:${selectedAlumni.email}`}>Send Email</button>
                <button className="btn-secondary" onClick={() => selectedAlumni.linkedin && window.open(selectedAlumni.linkedin)}>LinkedIn</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
