import Head from "next/head";
import AuthLayout from "~/components/layouts/authLayout";
import SignInForm from "~/app/Auth/Components/signInForm";

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <AuthLayout authMethod="Inicio sesión">
        <SignInForm />
      </AuthLayout>
    </>
  );
}
