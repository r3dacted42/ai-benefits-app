import { BenefitDetails } from "@/routes/BenefitDetails";
import { BenefitInput } from "@/routes/BenefitInput";
import { BenefitList } from "@/routes/BenefitList";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import type { ReactNode } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

const variants = {
    initial: { opacity: 0, y: 50 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -50 },
};

const pageTransition: Transition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3,
};

function PageAnimationWrapper({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={variants}
            transition={pageTransition}
            className="size-full"
        >
            {children}
        </motion.div>
    );
}

export function AnimatedRoutes() {
    const location = useLocation();

    return (
        <div className="size-full">
            <AnimatePresence mode="sync" initial={false}>
                <Routes location={location} key={location.pathname}>
                    <Route
                        index
                        element={
                            <PageAnimationWrapper>
                                <BenefitInput />
                            </PageAnimationWrapper>
                        }
                    />
                    <Route
                        path="/benefits"
                        element={
                            <PageAnimationWrapper>
                                <BenefitList />
                            </PageAnimationWrapper>
                        }
                    />
                    <Route
                        path="/benefits/:id"
                        element={
                            <PageAnimationWrapper>
                                <BenefitDetails />
                            </PageAnimationWrapper>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </div>
    );
}