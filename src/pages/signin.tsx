import Head from "next/head";
import AuthPageLayout from "~/components/auth/authPageLayout";
import SignInForm from "~/components/auth/signInForm";

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <AuthPageLayout>
        <SignInForm />
      </AuthPageLayout>
    </>
  );
}
