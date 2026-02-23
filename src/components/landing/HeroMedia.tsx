import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export function HeroMedia() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-muted bg-background/50 backdrop-blur-sm aspect-[16/9]">
      <AnimatePresence mode="wait">
        <motion.div
          key={resolvedTheme}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center bg-muted/20"
        >
          {resolvedTheme === "dark" ? (
            <img
              src="/lightmode.png"
              alt="FLUX Light Mode Preview"
              className="w-full h-full object-cover border-4 border-zinc-800 rounded-lg shadow-2xl"
            />
          ) : (
            <img
              src="/darkmode.png"
              alt="FLUX Dark Mode Preview"
              className="w-full h-full object-cover border-4 border-white rounded-lg shadow-2xl"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
