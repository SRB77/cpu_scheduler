import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun, Cpu, ArrowRight, Github } from "lucide-react";
import { Button } from "../components/ui/button";
import Particles from "../components/Particles";
import HyperText from "../components/HyperText";
import { HeroMedia } from "../components/landing/HeroMedia";
import { motion } from "framer-motion";

export function LandingPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const particleColor = resolvedTheme === "dark" ? "#ffffff" : "#000000";

  return (
    <div className="min-h-screen bg-background flex flex-col relative font-sans overflow-x-hidden">
      {/* Particles Background */}
      <Particles
        className="absolute inset-0 z-0 pointer-events-none"
        quantity={120}
        ease={80}
        color={particleColor}
        refresh
      />

      {/* Navbar */}
      <nav className="relative z-10 w-full py-4 border-b border-border/40 bg-background/60 backdrop-blur-md">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight">FLUX</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground mr-4">
              <Link
                to="/simulator"
                className="hover:text-foreground transition-colors"
              >
                Simulate
              </Link>
              <Link
                to="/docs"
                className="hover:text-foreground transition-colors"
              >
                Docs
              </Link>
              <Link
                to="/learn"
                className="hover:text-foreground transition-colors"
              >
                Learn
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full bg-muted/50 hover:bg-muted hidden sm:flex"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button
                onClick={() => navigate("/simulator")}
                className="rounded-full shadow-lg group"
              >
                Simulate Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="container mx-auto text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
              <span>🚀 The Ultimate OS Learning Tool</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="mb-6 flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4">
              <span className="block text-foreground">Master</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                <HyperText text="CPU Scheduling" className="inline-block" />
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            A powerful, interactive visualization tool for understanding
            operating system algorithms. Simulate, compare, and learn
            efficiently.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="w-full mt-8"
          >
            <HeroMedia />
          </motion.div>
        </div>
      </main>

      {/* Dummy Footer */}
      <footer className="relative z-10 w-full py-12 border-t border-border/40 bg-muted/20 mt-auto">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm md:text-left text-center">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Cpu className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg">FLUX</span>
              </div>
              <p className="text-muted-foreground max-w-xs mx-auto md:mx-0">
                Helping students and developers understand operating system
                concepts through interactive visualization.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-foreground">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    to="/learn"
                    className="hover:text-foreground transition-colors"
                  >
                    Learn Pages
                  </Link>
                </li>
                <li>
                  <Link
                    to="/docs"
                    className="hover:text-foreground transition-colors"
                  >
                    Docs
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-foreground">Connect</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="https://github.com/srb77/cpu_scheduler"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-foreground transition-colors justify-center md:justify-start"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/srb77"
                    className="hover:text-foreground transition-colors"
                  >
                    soumyaranjan
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/nox-pie"
                    className="hover:text-foreground transition-colors"
                  >
                    Prashant
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4 text-center">
            <p>
              © {new Date().getFullYear()} FLUX . Open source project.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
