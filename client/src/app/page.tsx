// app/page.tsx
import { Suspense } from "react";
import HomeContent from "../components/home/HomeContent";
export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
