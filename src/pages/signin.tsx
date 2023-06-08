import Head from "next/head";
import Link from "next/link";
import { CgClose } from "react-icons/cg";
import SignInForm from "~/components/auth/signInForm";

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <main className="flex min-h-screen flex-col py-10">
        <div className="flex justify-end pr-7 ">
          <Link href="/landing">
            <CgClose className="text-2xl" />
          </Link>
        </div>
        <SignInForm />
      </main>
    </>
  );
}
