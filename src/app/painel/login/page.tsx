import { FormularioLogin } from "@/components/painel/FormularioLogin";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ proxima?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { proxima } = await searchParams;

  return (
    <section className="login-tela">
      <FormularioLogin proxima={proxima} />
    </section>
  );
}
