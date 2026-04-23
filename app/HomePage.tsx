// app/HomePage.tsx - Client landing host that routes first-run users into timing setup.

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RouteFrame } from "@/components/RouteFrame";
import { usePracticePersistence } from "@/hooks/usePracticePersistence";
import { hasRequiredTiming } from "@/lib/practice-timing";

export function HomePage() {
  const router = useRouter();
  const { hydrated, state } = usePracticePersistence();

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    router.replace(hasRequiredTiming(state.timing) ? "/practice" : "/timing");
  }, [hydrated, router, state.timing]);

  return (
    <RouteFrame
      intro="Loading your Streets setup and routing you to the next task."
      preferences={state.preferences}
      title="Opening Streets"
    >
      <p>Preparing your practice workspace.</p>
    </RouteFrame>
  );
}
