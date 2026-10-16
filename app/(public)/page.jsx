import HomePage from "./HomePage";
import StructuredData from "@/components/site/StructuredData";
import { pageMetadata, siteDescription, websiteSchema } from "@/lib/seo";

export const metadata = pageMetadata({ title: "ACTPROVE | Defense Technology & Connected Systems", description: siteDescription, path: "/" });

export default function Page() {
  return <><StructuredData data={websiteSchema} /><HomePage /></>;
}
