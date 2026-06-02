import { useState, useEffect, useCallback } from "react";
import { BookOpen, Atom, FlaskConical, Sigma, Moon, Sun, Search, X, Info, Heart, GitCommit, Copy, ExternalLink } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import FileExplorer from "@/components/FileExplorer";
import SearchModal from "@/components/SearchModal";

const GITHUB_REPO = "Jivaansh-Yadav/11-isc-resources";
const DEVELOPER_NAME = "Jivaansh Yadav";
const UPI_ID = "jivaanshyadav@ptyes";
const UPI_LINK = "upi://pay?pa=jivaanshyadav@ptyes&pn=11th%20ISC%20Resources&cu=INR&tn=Donation%20for%2011th%20ISC%20Resources";
const UPI_QR_SRC = "/upi_qr.png";

// ---------------------
// TYPE: folder/file tree structure used by the JSON data
// ---------------------
interface FileNode {
  name: string;
  type: "folder" | "file";
  id?: string;
  children?: FileNode[];
}

// ---------------------
// SUBJECT CONFIG — edit here to add/rename subjects
// `file` is the JSON file inside /public/data/
// ---------------------
type SubjectKey = "english" | "physics" | "chemistry" | "maths";

const SUBJECTS: {
  key: SubjectKey;
  name: string;
  file: string;
  Icon: typeof BookOpen;
}[] = [
    { key: "physics", name: "Physics", file: "/data/physics.json", Icon: Atom },
    { key: "chemistry", name: "Chemistry", file: "/data/chemistry.json", Icon: FlaskConical },
    { key: "maths", name: "Maths", file: "/data/maths.json", Icon: Sigma },
    { key: "english", name: "English", file: "/data/english.json", Icon: BookOpen },
  ];

// ---------------------
// External links
// ---------------------
const DRIVE_URL = "https://drive.google.com/drive/folders/1ms1X7bkoF1igt8xFa_dCqTri_9IX8RbR";
const GITHUB_URL = "https://github.com/Jivaansh-Yadav/11-isc-resources";
const REDDIT_DEV_URL = "https://reddit.com/u/Appropriate-Cow-3178";
const DISCORD_DEV_URL = "https://discord.com/users/1444382978896560240";

// =============================================
// MAIN PAGE COMPONENT
// =============================================
const Index = () => {
  const { theme, toggle } = useTheme();
  const [subjectsData, setSubjectsData] = useState<Record<SubjectKey, FileNode | null>>({
    english: null, physics: null, chemistry: null, maths: null,
  });
  const [activeSubject, setActiveSubject] = useState<SubjectKey | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);

  // Global Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Show splash only once per browser session
  const [splashState, setSplashState] = useState<"playing" | "exiting" | "done">(() =>
    sessionStorage.getItem("splashShown") ? "done" : "playing"
  );

  // Fetch all subject JSONs on mount
  useEffect(() => {
    SUBJECTS.forEach((s) => {
      fetch(s.file)
        .then((r) => r.json())
        .then((data: FileNode) => setSubjectsData((prev) => ({ ...prev, [s.key]: data })))
        .catch(() => {/* ignore */ });
    });
  }, []);

  // After the loading bar animation finishes (~1.5s), start exit
  const handleBarEnd = useCallback(() => {
    setTimeout(() => {
      setSplashState("exiting");
      setTimeout(() => {
        setSplashState("done");
        sessionStorage.setItem("splashShown", "true");
      }, 350);
    }, 250);
  }, []);

  useEffect(() => {
    if (splashState !== "playing") return;
    const bar = document.getElementById("splash-bar");
    if (!bar) return;
    const handler = () => handleBarEnd();
    bar.addEventListener("animationend", handler);
    return () => bar.removeEventListener("animationend", handler);
  }, [splashState, handleBarEnd]);

  const activeData = activeSubject ? subjectsData[activeSubject] : null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">

      {/* ==================== SPLASH SCREEN ==================== */}
      {splashState !== "done" && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background ${splashState === "exiting" ? "splash-exit" : ""}`}>
          <div className="splash-book">
            <div
              className="w-40 h-40 flex items-center justify-center"
              style={{ perspective: "600px", perspectiveOrigin: "50% 95%" }}>
              <div
                className="relative"
                style={{
                  width: 90,
                  height: 80,
                  transformStyle: "preserve-3d",
                  transform: "translateX(35px) rotateX(12deg)"
                }}>
                <svg className="absolute" width="60" height="80" viewBox="0 0 60 80" fill="none">
                  <rect x="1" y="1" width="58" height="78" rx="2" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <div className="absolute book-page-3" style={{ width: 56, height: 74, left: 0, top: 3, transformOrigin: "left center" }}>
                  <svg width="56" height="74" viewBox="0 0 56 74" fill="none">
                    <rect x="1" y="1" width="54" height="72" rx="1" stroke="currentColor" strokeWidth="1" />
                    <line x1="8" y1="16" x2="40" y2="16" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                    <line x1="8" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                    <line x1="8" y1="32" x2="36" y2="32" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                  </svg>
                </div>
                <div className="absolute book-page-2" style={{ width: 56, height: 74, left: 0, top: 3, transformOrigin: "left center" }}>
                  <svg width="56" height="74" viewBox="0 0 56 74" fill="none">
                    <rect x="1" y="1" width="54" height="72" rx="1" stroke="currentColor" strokeWidth="1" />
                    <line x1="8" y1="18" x2="42" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                    <line x1="8" y1="26" x2="38" y2="26" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                  </svg>
                </div>
                <div className="absolute book-page-1" style={{ width: 56, height: 74, left: 0, top: 3, transformOrigin: "left center" }}>
                  <svg width="56" height="74" viewBox="0 0 56 74" fill="none">
                    <rect x="1" y="1" width="54" height="72" rx="1" stroke="currentColor" strokeWidth="1" />
                    <line x1="8" y1="20" x2="44" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
                    <line x1="8" y1="28" x2="40" y2="28" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
                    <line x1="8" y1="36" x2="48" y2="36" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
                  </svg>
                </div>
                <div className="absolute book-cover" style={{ width: 60, height: 80, left: 0, top: 0, transformOrigin: "left center" }}>
                  <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
                    <rect x="1" y="1" width="58" height="78" rx="2" stroke="currentColor" strokeWidth="1.8" />
                    <line x1="14" y1="30" x2="46" y2="30" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
                    <line x1="18" y1="38" x2="42" y2="38" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                    <line x1="22" y1="46" x2="38" y2="46" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <p className="splash-title mt-6 text-xl font-semibold tracking-tight text-foreground text-center">
            11th ISC Resources
          </p>

          <div id="splash-bar" className="splash-bar mt-3" />
        </div>
      )}

      {/* ==================== ANIMATED BACKGROUND BLOBS ==================== */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse" style={{ background: "hsl(var(--primary))" }} />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-15 dark:opacity-[0.07] blur-3xl animate-pulse" style={{ background: "hsl(var(--primary) / 0.7)", animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10 dark:opacity-[0.05] blur-3xl animate-pulse" style={{ background: "hsl(var(--accent))", animationDelay: "4s" }} />
      </div>

      {/* ==================== TOP-RIGHT CONTROLS ==================== */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="p-3 rounded-full bg-card border border-border shadow-lg backdrop-blur-sm hover:scale-110 active:scale-95 transition-transform"
          aria-label="Search files"
          title="Search (Ctrl+K)"
        >
          <Search className="h-5 w-5 text-foreground" />
        </button>
        <button
          onClick={toggle}
          className="p-3 rounded-full bg-card border border-border shadow-lg backdrop-blur-sm hover:scale-110 active:scale-95 transition-transform"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5 text-foreground" />
          ) : (
            <Sun className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>

      {/* ==================== HERO / HEADING ==================== */}
      {/* ==================== TOP-LEFT CONTROLS (Info + Donate) ==================== */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setInfoOpen(true)}
          className="p-3 rounded-full bg-card border border-border shadow-lg backdrop-blur-sm hover:scale-110 active:scale-95 transition-transform"
          aria-label="Site info"
          title="About / latest update"
        >
          <Info className="h-5 w-5 text-foreground" />
        </button>
        <button
          onClick={() => setDonateOpen(true)}
          className="p-3 rounded-full bg-card border border-border shadow-lg backdrop-blur-sm hover:scale-110 active:scale-95 transition-transform"
          aria-label="Support / Donate"
          title="Support / Donate"
        >
          <Heart className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* ==================== INFO MODAL ==================== */}
      {infoOpen && <InfoModal onClose={() => setInfoOpen(false)} />}

      {/* ==================== DONATE MODAL ==================== */}
      {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
          11th ISC Resources
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Your one-stop hub for Class 11 ISC notes, papers, and study materials.
        </p>
      </div>

      {/* ==================== SUBJECT CARDS (2x2 square grid) ==================== */}
      <div
        className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-md sm:max-w-lg animate-fade-in"
        style={{ animationDelay: "0.15s" }}
      >
        {SUBJECTS.map(({ key, name, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSubject(key)}
            className="group aspect-square rounded-2xl border border-border bg-card shadow-sm
                       flex flex-col items-center justify-center gap-3 p-4
                       hover:-translate-y-1 hover:shadow-lg hover:border-primary/30
                       transition-all duration-200"
          >
            <div className="rounded-2xl bg-primary/10 p-4 group-hover:bg-primary/15 transition-colors">
              <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground">{name}</h2>
          </button>
        ))}
      </div>

      {/* ==================== FILE EXPLORER MODAL ==================== */}
      {activeSubject && activeData && (
        <FileExplorer data={activeData} onClose={() => setActiveSubject(null)} />
      )}

      {/* ==================== SEARCH MODAL ==================== */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ==================== FLOATING FOOTER ==================== */}
      <SocialFooter />
    </div>
  );
};

// =============================================
// SOCIAL FOOTER — direct links to developer profiles & resources
// =============================================
const SocialFooter = () => {
  return (
    <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 px-6 py-3 rounded-full bg-card/80 backdrop-blur-md shadow-lg border border-border/50">
      {/* Reddit — direct to developer's profile */}
      <a href={REDDIT_DEV_URL} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-accent hover:scale-110 active:scale-95 transition-all" title="Developer on Reddit">
        <svg className="h-5 w-5 text-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" /></svg>
      </a>
      {/* Discord — direct to developer's profile */}
      <a href={DISCORD_DEV_URL} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-accent hover:scale-110 active:scale-95 transition-all" title="Developer on Discord">
        <svg className="h-5 w-5 text-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
      </a>
      {/* GitHub */}
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-accent hover:scale-110 active:scale-95 transition-all" title="GitHub Repository">
        <svg className="h-5 w-5 text-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
      </a>
      {/* Google Drive */}
      <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-accent hover:scale-110 active:scale-95 transition-all" title="Google Drive Folder">
        <svg className="h-5 w-5 text-foreground" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.997 12.536L.742 8.93L4.8 1.715h4.51l4.057 7.214l-2.254 3.607z" />
          <path d="M4.798 1.715l4.509 7.214" />
          <path d="M13.368 8.932H5.023" />
          <path d="M2.997 12.536l4.058-7.214" />
        </svg>
      </a>
    </footer>
  );
};

export default Index;
// =============================================
// INFO MODAL — fetches latest commit from GitHub and shows developer info
// =============================================
const InfoModal = ({ onClose }: { onClose: () => void }) => {
  const [commit, setCommit] = useState<{
    message: string;
    date: string;
    sha: string;
    author: string;
    url: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=1`)
      .then((r) => {
        if (!r.ok) throw new Error("GitHub API: " + r.status);
        return r.json();
      })
      .then((data) => {
        const c = data[0];
        setCommit({
          message: c.commit.message,
          date: c.commit.author.date,
          sha: c.sha.substring(0, 7),
          author: c.commit.author.name,
          url: c.html_url,
        });
      })
      .catch((e) => setError(e.message));
  }, []);

  // Format date with seconds
  const formatted = commit
    ? new Date(commit.date).toLocaleString(undefined, {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    })
    : "";

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="fixed z-[90] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md animate-scale-in">
        <div className="rounded-2xl border border-border bg-card shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">About this site</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-accent">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Developed by <span className="font-medium text-foreground">{DEVELOPER_NAME}</span>
          </p>

          <div className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 mb-2">
              <GitCommit className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Latest commit
              </span>
            </div>

            {error && <p className="text-sm text-destructive">Could not load: {error}</p>}
            {!commit && !error && <p className="text-sm text-muted-foreground">Loading…</p>}

            {commit && (
              <>
                <p className="text-sm text-foreground font-medium mb-1 break-words">
                  {commit.message.split("\n")[0]}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  by {commit.author} · <span className="font-mono">{commit.sha}</span>
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Updated: <span className="text-foreground">{formatted}</span>
                </p>
                <a
                  href={commit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  View on GitHub <ExternalLink className="h-3 w-3" />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// =============================================
// DONATE MODAL — UPI payment options
// =============================================
const DonateModal = ({ onClose }: { onClose: () => void }) => {
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="fixed z-[90] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md animate-scale-in">
        <div className="rounded-2xl border border-border bg-card shadow-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Support / Donate</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-accent">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-5">
            If this site has helped you in your studies, consider supporting its development.
            Every contribution helps keep these resources free and updated.
          </p>

          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <div className="rounded-xl border border-border bg-background p-3">
              <img
                src={UPI_QR_SRC}
                alt="UPI QR Code"
                className="h-48 w-48 object-contain"
              />
            </div>
          </div>

          {/* Pay with UPI app link */}
          <a
            href={UPI_LINK}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all mb-3"
          >
            Pay with any UPI app
            <ExternalLink className="h-4 w-4" />
          </a>

          {/* UPI ID copy */}
          <button
            onClick={copyId}
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-border bg-background hover:bg-accent/40 transition-colors text-left"
          >
            <div>
              <p className="text-xs text-muted-foreground">UPI ID</p>
              <p className="text-sm font-mono text-foreground">{UPI_ID}</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Copy className="h-3.5 w-3.5" />
              {copied ? "Copied!" : "Copy"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};