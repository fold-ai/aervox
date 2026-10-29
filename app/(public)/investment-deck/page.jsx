import InvestmentDeckContent from "@/components/site/InvestmentDeckContent";

export const metadata = {
  title: "ACTPROVE | Investment Deck",
  description: "ACTPROVE investor presentation: a 50-system Wild Hornets contract, a conditional follow-on opportunity, prototype evidence and a $1.5M equity round.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/investment-deck" },
};

export default function InvestmentDeckPage() {
  return <InvestmentDeckContent />;
}
