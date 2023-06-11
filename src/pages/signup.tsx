import Head from "next/head";
import AuthLayout from "~/components/auth/authLayout";
import SignUpForm from "~/components/auth/signUpForm";

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
