"use client";

import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

/*
  Public Spline gaming scene — controller/console 3D clay.
  URL points to a free published scene from spline.design community.
  Replace with your own scene URL once you create one on spline.design.
*/
const SCENE_URL =
  "https://prod.spline.design/kZBDh4T2MK9bN3Gy/scene.splinecode";

export function SplineScene() {
  return (
    <div className="relative w-full h-full min-h-[420px]">
      <Suspense
        fallback={
          <div className="flex h-full min-h-[420px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-14 w-14 rounded-full border-4 border-indigo-600/30 border-t-indigo-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-500">Chargement 3D...</p>
            </div>
          </div>
        }
      >
        <Spline
          scene={SCENE_URL}
          style={{ width: "100%", height: "100%", minHeight: "420px" }}
        />
      </Suspense>
    </div>
  );
}
