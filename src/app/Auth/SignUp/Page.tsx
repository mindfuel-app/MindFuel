import SignUpForm from "../Components/signUpForm";
import AuthLayout from "../Components/layout";

export const metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return (
    <AuthLayout authMethod="Registrarse">
      <SignUpForm />
    </AuthLayout>
  );
}
