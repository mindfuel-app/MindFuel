import { Button } from "../ui/button";

export default function AuthButton({
  method,
}: {
  method: "Sign up" | "Sign in";
}) {
  return (
    <Button
      type="submit"
      className="no-highlight w-full rounded-xl bg-[#008080] px-5 py-2 text-center text-lg text-white active:bg-[#008080]/70"
    >
      {method == "Sign up" ? "Registrarse" : "Inicia sesión"}
    </Button>
  );
}
