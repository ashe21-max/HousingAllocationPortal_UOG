import { VerifyPanel } from "@/features/auth/components/verify-panel";

type VerifyPageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { userId } = await params;

  return <VerifyPanel userId={userId} />;
}
