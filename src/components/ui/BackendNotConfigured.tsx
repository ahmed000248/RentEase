import { DatabaseZap } from "lucide-react";

export default function BackendNotConfigured({ message }: { message?: string }) {
  return (
    <div className="max-w-lg mx-auto text-center py-24 px-6">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
        <DatabaseZap className="w-6 h-6 text-brand-green" />
      </div>
      <h1 className="text-xl font-bold text-white mb-3">Firebase isn&apos;t connected yet</h1>
      <p className="text-white/50 text-sm leading-relaxed">
        {message ??
          "This page reads live data from Firestore, but no Firebase project credentials are configured yet. Add FIREBASE_SERVICE_ACCOUNT_KEY and the NEXT_PUBLIC_FIREBASE_* variables to your environment to see real data here."}
      </p>
    </div>
  );
}
