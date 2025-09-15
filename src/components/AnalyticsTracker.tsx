"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface AnalyticsData {
  path: string;
  timestamp: string;
  user_agent: string;
  referrer: string;
  student_nis?: string;
  session_id: string;
  screen_resolution: string;
  viewport_size: string;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const trackedPaths = useRef(new Set<string>());
  const sessionIdRef = useRef<string>("");
  const [studentNis, setStudentNis] = useState<string | undefined>();


  // Generate or get session ID
  useEffect(() => {
    if (typeof window !== "undefined") {
      let sessionId = localStorage.getItem("traficare_session");
      let studentNis = localStorage.getItem("traficare_nis");
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("traficare_session", sessionId);
      }
      sessionIdRef.current = sessionId;
      setStudentNis(studentNis ?? undefined);
    }
  }, []);

  // Track page view
  useEffect(() => {
    if (typeof window === "undefined") return;

    const trackPageView = async () => {
      // Avoid double tracking the same path in this session
      const trackingKey = `${pathname}_${sessionIdRef.current}`;
      if (trackedPaths.current.has(trackingKey)) return;
      
      trackedPaths.current.add(trackingKey);

      try {
        const analyticsData: AnalyticsData = {
          path: pathname,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          referrer: document.referrer || "",
          student_nis: studentNis,
          session_id: sessionIdRef.current,
          screen_resolution: `${screen.width}x${screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        };

        // Send to our analytics endpoint
        await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(analyticsData),
        });

        console.log("📊 Analytics tracked:", pathname);
      } catch (error) {
        console.error("Analytics tracking failed:", error);
      }
    };

    // Small delay to ensure page is fully loaded
    const timeoutId = setTimeout(trackPageView, 100);
    return () => clearTimeout(timeoutId);
  }, [pathname, studentNis]);

  // Track user interactions
  useEffect(() => {
    if (typeof window === "undefined") return;

    const trackClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      // Track important clicks (buttons, links, etc.)
      const isTrackableElement = target.tagName === "BUTTON" || 
                                 target.tagName === "A" || 
                                 target.closest("button") || 
                                 target.closest("a");

      if (isTrackableElement) {
        try {
          const elementInfo = {
            type: "click",
            path: pathname,
            element: target.tagName.toLowerCase(),
            text: target.textContent?.trim().substring(0, 100) || "",
            timestamp: new Date().toISOString(),
            student_nis: studentNis,
            session_id: sessionIdRef.current,
          };

          await fetch("/api/analytics/interactions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(elementInfo),
          });
        } catch (error) {
          console.error("Interaction tracking failed:", error);
        }
      }
    };

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScroll = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollDepth > maxScrollDepth && scrollDepth >= 25 && scrollDepth % 25 === 0) {
        maxScrollDepth = scrollDepth;
        
        try {
          fetch("/api/analytics/interactions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "scroll",
              path: pathname,
              scroll_depth: scrollDepth,
              timestamp: new Date().toISOString(),
              student_nis: studentNis,
              session_id: sessionIdRef.current,
            }),
          });
        } catch (error) {
          console.error("Scroll tracking failed:", error);
        }
      }
    };

    document.addEventListener("click", trackClick);
    window.addEventListener("scroll", trackScroll, { passive: true });

    return () => {
      document.removeEventListener("click", trackClick);
      window.removeEventListener("scroll", trackScroll);
    };
  }, [pathname, studentNis]);

  return null; // This component doesn't render anything
}
