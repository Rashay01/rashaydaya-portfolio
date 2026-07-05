import React from 'react'

export const motion = new Proxy({} as Record<string, unknown>, {
  get: (_, tag) => {
    const Component = React.forwardRef(
      ({ children, ...rest }: Record<string, unknown> & { children?: React.ReactNode }, ref: React.Ref<unknown>) =>
        React.createElement(String(tag), { ...rest, ref }, children),
    )
    Component.displayName = `motion.${String(tag)}`
    return Component
  },
})

export const AnimatePresence = ({ children }: { children?: React.ReactNode }) => <>{children}</>
export const useReducedMotion = () => false
export const useInView = () => true
export const useScroll = () => ({ scrollYProgress: { on: () => () => {} } })
export const useMotionValueEvent = () => {}
export const useMotionValue = (v: unknown) => ({ set: () => {}, get: () => v })
export const useSpring = (v: unknown) => v
