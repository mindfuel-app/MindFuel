import { Button } from "../ui/button";

export default function AuthButton({
  method,
}: {
  method: "Sign up" | "Sign in";
}) {
  return (
    <Button
      type="submit"
      className="no-highlight w-full transform rounded-xl bg-[#008080] px-5 py-2 text-center text-lg text-white transition duration-200 ease-in-out active:scale-[.98] active:bg-[#008080]/70"
    >
      {method == "Sign up" ? "Registrarse" : "Inicia sesión"}
    </Button>
  );
}
