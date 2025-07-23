import { useEffect } from "react";
import { useRouter } from "next/router";

export default function DiscoverPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified recipes page with community tab
    void router.replace("/recipes?tab=community");
  }, [router]);

  return null; // Component will redirect before rendering
}