import { Button } from "../ui/button";
import { CircularProgress } from "@mui/material";

export default function AuthButton({
  method,
  isDisabled,
}: {
  method: "Sign up" | "Sign in";
  isDisabled: boolean;
}) {
  return (
    <Button
      type="submit"
      className="no-highlight w-full rounded-xl bg-[#008080] px-5 py-2 text-center text-lg text-white active:bg-[#008080]/70 "
      disabled={isDisabled}
    >
      {!isDisabled && (method === "Sign up" ? "Registrarse" : "Inicia sesión")}
      {isDisabled && <CircularProgress color="inherit" size={20} />}
    </Button>
  );
}
