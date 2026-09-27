import { Suspense } from "react";
import ProcurementFlow from "@/components/procurement/ProcurementFlow";

export default function Home() {
  return (
    // ProcurementFlow reads `?start=` from the URL, so it renders on the client.
    <Suspense>
      <ProcurementFlow />
    </Suspense>
  );
}
