import FinanceClient from "./_components/finance-client.tsx";
import { getFinances } from "./lib/data";

export default async function Finance() {
  const data = await getFinances();
  return <FinanceClient data={data} />;
}
