import { motion, type Transition } from 'framer-motion';
import type { ReactNode } from 'react';

const variants = {
    initial: {
        opacity: 0,
        y: 50,
    },
    in: {
        opacity: 1,
        y: 0,
    },
    out: {
        opacity: 0,
        y: -50,
    },
};

const pageTransition: Transition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.15,
};

export function PageAnimationWrapper({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={variants}
            transition={pageTransition}
            className="absolute w-full"
        >
            {children}
        </motion.div>
    );
}

