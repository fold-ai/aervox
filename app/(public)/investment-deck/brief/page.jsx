import InvestmentDeckContent from "@/components/site/InvestmentDeckContent";

export const metadata = {
  title: "ACTPROVE | Investor Brief",
  description: "A six-slide introduction to ACTPROVE, ACT-1 and PROVE-1, manufacturer collaboration, validation strategy and the planned equity round.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/investment-deck/brief" },
};

export default function InvestorBriefPage() {
  return <InvestmentDeckContent brief />;
}
