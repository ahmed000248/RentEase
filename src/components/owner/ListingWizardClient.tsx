"use client";

import Link from "next/link";
import { WizardProvider, useWizard } from "./wizard/WizardContext";
import WizardSidebar from "./wizard/WizardSidebar";
import Step1Basics from "./wizard/Step1Basics";
import Step2Specs from "./wizard/Step2Specs";
import Step3Location from "./wizard/Step3Location";
import Step4Media from "./wizard/Step4Media";
import Step5Publish from "./wizard/Step5Publish";

interface Props {
  ownerName: string;
  ownerId: string;
}

function WizardContent({ ownerId }: { ownerId: string }) {
  const { step } = useWizard();
  return (
    <>
      <WizardSidebar />

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 px-6 flex justify-between items-center bg-[#121315] border-b border-[#3b4b3a] z-50">
        <div className="flex items-center gap-4">
          <span className="font-heading font-black text-[#00ff66] text-xl tracking-tight">RentEase</span>
          <div className="h-5 w-px bg-[#3b4b3a]" />
          <span className="text-[11px] text-[#b9ccb5] uppercase tracking-widest">New Listing Wizard</span>
        </div>
        <Link
          href="/owner/listings"
          className="text-sm text-[#b9ccb5] hover:text-[#e3e2e5] hover:bg-[#343537] px-4 py-2 rounded-lg transition-colors"
        >
          Save & Exit
        </Link>
      </header>

      {/* Main Canvas */}
      <main className="ml-64 mt-16 min-h-[calc(100vh-64px)] bg-[#121315] overflow-y-auto">
        <div className="max-w-[1440px] mx-auto px-10 py-10">
          {step === 1 && <Step1Basics />}
          {step === 2 && <Step2Specs />}
          {step === 3 && <Step3Location />}
          {step === 4 && <Step4Media />}
          {step === 5 && <Step5Publish ownerId={ownerId} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-64 right-0 h-14 px-6 flex justify-between items-center bg-[#0d0e10] border-t border-[#3b4b3a] z-40">
        <p className="text-[12px] text-[#b9ccb5]">© 2024 RentEase Management</p>
        <div className="flex gap-6">
          {["Support", "Privacy Policy", "Terms"].map((l) => (
            <a key={l} href="#" className="text-[12px] text-[#b9ccb5] hover:text-[#6bff83] transition-colors">
              {l}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}

export default function ListingWizardClient({ ownerName: _ownerName, ownerId }: Props) {
  return (
    <div className="min-h-screen bg-[#121315] font-dashboard">
      <WizardProvider>
        <WizardContent ownerId={ownerId} />
      </WizardProvider>
    </div>
  );
}
