import InvestmentDeckContent from "@/components/site/InvestmentDeckContent";

export const metadata = {
  title: "ACTPROVE | Investor Brief",
  description: "A six-slide introduction to ACTPROVE, its agreed 50-system Wild Hornets technical scope, onboard test evidence and planned equity round.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/investment-deck/brief" },
};

export default function InvestorBriefPage() {
  return <InvestmentDeckContent brief />;
}
