import router from "next/router";
import { Button } from "../ui/button";

export default function ForgotPasswordButton() {
  return (
    <Button
      variant="outline"
      onClick={() => void router.push("/reestablecer-contraseña")}
      className="no-highlight w-48 border-2 border-[#008080] bg-transparent text-[#008080]"
    >
      Olvidé la contraseña
    </Button>
  );
}
