import { BenefitDetails } from "@/routes/BenefitDetails";
import { BenefitInput } from "@/routes/BenefitInput";
import { BenefitList } from "@/routes/BenefitList";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { PageAnimationWrapper } from "./PageAnimationWrapper";

export function AnimatedRoutes() {
    const location = useLocation();

    return (
        <div className="w-full">
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