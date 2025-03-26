import SourcePageClient from "./_components/source-page-client";
import { getSources } from "./lib/data";

export default async function SourcePage() {
  const data = await getSources();

  return <SourcePageClient data={data} />;
}
