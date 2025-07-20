import { Button } from "../ui/button";
import { CircularProgress } from "@mui/material";

export default function AuthButton({
  method,
  isDisabled,
  onClick,
}: {
  method: "Sign up" | "Sign in" | "Forgot password" | "Reset password";
  isDisabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="submit"
      className="no-highlight w-full rounded-xl bg-teal px-5 py-2 text-center text-lg text-white active:bg-teal/70 "
      disabled={isDisabled}
      onClick={onClick}
    >
      {!isDisabled && (
        <>
          {method === "Sign up" && "Registrarse"}
          {method === "Sign in" && "Iniciar sesión"}
          {method === "Forgot password" && "Confirmar"}
          {method === "Reset password" && "Cambiar contraseña"}
        </>
      )}
      {isDisabled && <CircularProgress color="inherit" size={20} />}
    </Button>
  );
}
