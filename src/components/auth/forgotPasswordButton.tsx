import router from "next/router";
import { Button } from "../ui/button";

export default function ForgotPasswordButton() {
  return (
    <Button
      variant="outline"
      onClick={() => void router.push("/reestablecer-contraseña")}
      className="no-highlight w-48 rounded-lg border-2 border-[#008080] bg-transparent font-medium text-[#008080] hover:bg-transparent active:bg-black/5"
    >
      Olvidé la contraseña
    </Button>
  );
}
