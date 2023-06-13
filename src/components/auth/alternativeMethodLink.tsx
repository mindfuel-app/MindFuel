import Link from "next/link";

export default function AlternativeMethodLink({
  method,
}: {
  method: "Sign up" | "Sign in";
}) {
  if (method == "Sign up") {
    return (
      <div className="flex justify-center">
        <p className="text-extrabold ml-2 text-xs">
          No tienes una cuenta?,{" "}
          <Link
            href="/signup"
            className="no-highlight text-sky-600 underline-offset-2 active:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <p className="text-xs">
        Ya tienes una cuenta?,{" "}
        <Link
          href="/signin"
          className="no-highlight text-sky-600 underline-offset-2 active:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
