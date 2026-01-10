import { HamsterLoader } from "@/components/ui/hamster-loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <HamsterLoader />
        <p className="text-slate-600 font-medium animate-pulse">Loading amazing things...</p>
      </div>
    </div>
  );
}
