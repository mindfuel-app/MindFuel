import Link from "next/link";

export default function ForgotPasswordButton() {
  return (
    <Link
      href="/reestablecer-contrasena"
      className="no-highlight font-medium underline-offset-[3px] active:underline"
    >
      ¿Olvidaste tu contraseña?
    </Link>
  );
}
