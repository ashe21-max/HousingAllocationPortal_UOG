import { PasswordSetupPanel } from "@/features/auth/components/password-setup-panel";

type PasswordSetupPageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function PasswordSetupPage({
  params,
}: PasswordSetupPageProps) {
  const { userId } = await params;

  return <PasswordSetupPanel userId={userId} />;
}
