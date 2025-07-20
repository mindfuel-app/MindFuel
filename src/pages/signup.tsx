import Head from "next/head";
import AuthPageLayout from "~/components/layouts/authLayout";
import SignUpForm from "~/app/Auth/Components/signUpForm";

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
