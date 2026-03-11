import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"

/**
 * Circular Reveal Theme Toggle
 * Expanding circle wipe animation from the toggle switch position.
 * Enhanced with smooth spring physics and icon transitions.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = useCallback(() => {
    const btn = buttonRef.current
    if (!btn) {
      setTheme(theme === 'dark' ? 'light' : 'dark')
      return
    }

    const rect = btn.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    // Calculate max radius needed to cover entire viewport
    const maxRadius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    )

    const isDark = theme === 'dark'
    const nextTheme = isDark ? 'light' : 'dark'

    // Add transitioning class — enables smooth bg/color transition only during switch
    document.documentElement.classList.add('theme-transitioning')
    const clearTransition = () => document.documentElement.classList.remove('theme-transitioning')

    // Check if View Transitions API is available
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      // Use the native View Transitions API for smooth circular reveal
      const transition = (document as any).startViewTransition(() => {
        setTheme(nextTheme)
      })

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${cx}px ${cy}px)`,
          `circle(${maxRadius}px at ${cx}px ${cy}px)`,
        ]

        document.documentElement.animate(
          { clipPath: isDark ? clipPath : clipPath },
          {
            duration: 600,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
      }).catch(() => {
        // Fallback — transition still works, just without circle animation
      })

      transition.finished.then(clearTransition).catch(clearTransition)
    } else {
      // Fallback: Use a CSS overlay for non-supporting browsers
      performFallbackReveal(cx, cy, maxRadius, nextTheme, isDark)
      setTimeout(clearTransition, 700)
    }
  }, [theme, setTheme])

  const performFallbackReveal = useCallback(
    (cx: number, cy: number, maxRadius: number, nextTheme: string, wasDark: boolean) => {
      const overlay = document.createElement('div')
      overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 99999;
        pointer-events: none;
        background: ${wasDark ? '#F8FAFC' : '#060C1A'};
        clip-path: circle(0px at ${cx}px ${cy}px);
        transition: clip-path 600ms cubic-bezier(0.22, 1, 0.36, 1);
      `
      document.body.appendChild(overlay)

      // Force reflow
      overlay.offsetHeight

      overlay.style.clipPath = `circle(${maxRadius}px at ${cx}px ${cy}px)`
      setTheme(nextTheme)

      setTimeout(() => {
        overlay.remove()
      }, 650)
    },
    [setTheme]
  )

  if (!mounted) {
    return <div className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded-full" aria-label="Loading theme toggle" role="status" />
  }

  const isDark = theme === 'dark'

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={`relative w-16 h-8 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 overflow-hidden ${
        isDark
          ? 'bg-gradient-to-r from-[#0c1929] to-[#1a2744] border border-[#3B82F6]/30 shadow-[0_0_16px_rgba(59,130,246,0.25)]'
          : 'bg-gradient-to-r from-[#dbeafe] to-[#bfdbfe] border border-[#3B82F6]/25 shadow-[0_2px_8px_rgba(37,99,235,0.15)]'
      }`}
      aria-label="Toggle Theme"
    >
      {/* Stars/dots background for dark mode */}
      {isDark && (
        <>
          <motion.span
            className="absolute w-1 h-1 rounded-full bg-white/40"
            style={{ top: '30%', left: '15%' }}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            className="absolute w-0.5 h-0.5 rounded-full bg-white/30"
            style={{ top: '55%', left: '25%' }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <motion.span
            className="absolute w-0.5 h-0.5 rounded-full bg-blue-300/40"
            style={{ top: '25%', left: '35%' }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </>
      )}

      {/* Sun rays for light mode */}
      {!isDark && (
        <motion.div
          className="absolute w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <span className="absolute w-0.5 h-0.5 rounded-full bg-amber-400/30" style={{ top: '20%', left: '60%' }} />
          <span className="absolute w-0.5 h-0.5 rounded-full bg-amber-400/20" style={{ top: '65%', left: '70%' }} />
        </motion.div>
      )}

      {/* Toggle knob */}
      <motion.div
        className={`absolute top-[3px] left-[3px] w-[26px] h-[26px] rounded-full flex items-center justify-center shadow-lg ${
          isDark
            ? 'bg-gradient-to-br from-[#1e3a5f] to-[#2563EB] shadow-blue-500/30'
            : 'bg-gradient-to-br from-white to-blue-50 shadow-blue-300/20'
        }`}
        animate={{ x: isDark ? 32 : 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          mass: 0.8,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Moon className="w-3.5 h-3.5 text-[#93C5FD]" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Sun className="w-3.5 h-3.5 text-[#2563EB]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  )
}