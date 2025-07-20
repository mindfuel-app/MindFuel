import Link from "next/link";

export default function AlternativeMethodLink({
  method,
}: {
  method: "Sign up" | "Sign in";
}) {
  if (method == "Sign up") {
    return (
      <div className="flex justify-center">
        <span className="text-sm font-medium">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/signup"
            className="no-highlight text-sky-600 underline-offset-2 active:underline"
          >
            Regístrate
          </Link>
        </span>
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <span className="text-sm font-medium">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/signin"
          className="no-highlight text-sky-600 underline-offset-2 active:underline"
        >
          Inicia sesión
        </Link>
      </span>
    </div>
  );
}
