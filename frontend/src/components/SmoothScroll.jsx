/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import LocomotiveScroll from "locomotive-scroll";

const SmoothScrollContext = createContext(null);

export function useSmoothScroll() {
    return useContext(SmoothScrollContext);
}

function SmoothScroll({ children }) {
    const instanceRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reducedMotion) return undefined;

        const scroll = new LocomotiveScroll({
            lenisOptions: {
                lerp: 0.1,
                duration: 1.05,
                smoothWheel: true,
                syncTouch: false,
                touchMultiplier: 1.15,
                wheelMultiplier: 0.9,
                orientation: "vertical",
                gestureOrientation: "vertical",
            },
            autoStart: true,
        });

        instanceRef.current = scroll;

        return () => {
            scroll.destroy();
            instanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        const scroll = instanceRef.current;
        if (!scroll) {
            window.scrollTo(0, 0);
            return;
        }

        scroll.scrollTo(0, { immediate: true });
        scroll.resize();
    }, [location.pathname]);

    return (
        <SmoothScrollContext.Provider value={instanceRef}>
            {children}
        </SmoothScrollContext.Provider>
    );
}

export default SmoothScroll;
