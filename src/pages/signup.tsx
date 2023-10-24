import Head from "next/head";
import AuthPageLayout from "~/components/layouts/authLayout";
import SignUpForm from "~/components/auth/signUpForm";

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <AuthPageLayout authMethod="Registrarse">
        <SignUpForm />
      </AuthPageLayout>
    </>
  );
}
