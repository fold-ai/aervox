import InvestmentDeckContent from "@/components/site/InvestmentDeckContent";

export const metadata = {
  title: "ACTPROVE | Investment Deck",
  description: "ACTPROVE: onboard hardware and software for drone manufacturers. Target equity raise of $1.5M at a $20M post-money valuation.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/investment-deck" },
};

export default function InvestmentDeckPage() {
  return <InvestmentDeckContent />;
}
