import SignInForm from "../Components/signInForm";
import AuthLayout from "../Components/layout";

export const metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <AuthLayout authMethod="Inicio sesión">
      <SignInForm />
    </AuthLayout>
  );
}
