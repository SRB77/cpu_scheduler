import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun, Cpu } from "lucide-react";
import { Button } from "../components/ui/button";
import { learnContent } from "../data/learnContent";

// Topics Navigation
const topics = [
  { id: "getting-started", title: "Getting Started" },
  { id: "fcfs", title: "First Come First Serve (FCFS)" },
  { id: "sjf", title: "Shortest Job First (SJF)" },
  { id: "srtf", title: "Shortest Remaining Time First" },
  { id: "rr", title: "Round Robin (RR)" },
  { id: "priority", title: "Priority Scheduling" },
];

export function LearnPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState("getting-started");
  const [activeSection, setActiveSection] = useState("");

  const currentContent = learnContent[activeTopic];

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Scroll Spy logic for Right Sidebar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -40% 0px" }, // Adjust offset for better triggering
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [activeTopic, currentContent]); // Re-bind observer if topic changes

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:inline-block">
              FLUX
            </span>
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link
                to="/simulator"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Simulator
              </Link>
              <Link
                to="/docs"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Docs
              </Link>
              <Link
                to="/learn"
                className="text-foreground transition-colors font-semibold"
              >
                Learn
              </Link>
            </nav>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full bg-muted/50 hover:bg-muted ml-2"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex container mx-auto items-start">
        {/* Left Sidebar - Navigation */}
        <aside className="sticky top-14 h-[calc(100vh-3.5rem)] hidden md:block w-64 shrink-0 overflow-y-auto border-r border-border/40 py-6 pr-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground pl-2 uppercase tracking-wider">
              CPU Scheduling
            </h4>
            <div className="grid grid-flow-row auto-rows-max text-sm gap-1">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopic(topic.id)}
                  className={`flex w-full items-center rounded-md border border-transparent px-2 py-1.5 hover:underline focus:outline-none ${
                    activeTopic === topic.id
                      ? "font-medium text-primary bg-primary/10"
                      : "text-muted-foreground"
                  }`}
                >
                  {topic.title}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center - Main Content */}
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px] flex-1 min-w-0 px-4 md:px-8">
          <div className="mx-auto w-full min-w-0">
            {currentContent ? (
              <div className="space-y-12 pb-12">
                <div className="space-y-4">
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {currentContent.title}
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    {currentContent.description}
                  </p>
                </div>

                {currentContent.sections.map((section, index) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className={`scroll-mt-20 space-y-4 ${
                      index !== 0 ? "mt-12" : ""
                    }`}
                  >
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors">
                      {section.title}
                    </h2>
                    <div className="pt-2 text-foreground/90">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                Select a topic from the sidebar to begin learning.
              </div>
            )}
          </div>

          {/* Right Sidebar - Table of Contents */}
          <div className="hidden xl:block text-sm">
            <div className="sticky top-20 -mt-10 h-[calc(100vh-3.5rem)] pt-10 overflow-y-auto">
              <div className="space-y-2 pl-4 border-l border-border/40">
                <h4 className="font-semibold text-foreground mb-4">
                  On this page
                </h4>
                <ul className="m-0 list-none space-y-2">
                  {currentContent?.sections.map((item) => (
                    <li key={item.id} className="mt-0 pt-0">
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(item.id)?.scrollIntoView({
                            behavior: "smooth",
                          });
                        }}
                        className={`inline-block no-underline transition-colors hover:text-foreground ${
                          activeSection === item.id
                            ? "font-medium text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LearnPage;
