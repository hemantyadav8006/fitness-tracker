"use client";

import dynamic from "next/dynamic";

const SceneBackground = dynamic(
  () =>
    import("./SceneBackground").then((m) => m.SceneBackground),
  { ssr: false, loading: () => null },
);

export function SceneBackgroundLazy() {
  return <SceneBackground />;
}
