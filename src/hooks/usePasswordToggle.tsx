import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function usePasswordToggle(isPasswordWrong?: boolean) {
  const [visible, setVisibility] = useState(false);

  const inputType = visible ? "text" : "password";

  const className = isPasswordWrong ? "text-red-500" : "text-gray-500";

  const Icon = visible ? (
    <FaEyeSlash className={className} onClick={() => setVisibility(false)} />
  ) : (
    <FaEye className={className} onClick={() => setVisibility(true)} />
  );

  return [inputType, Icon];
}
