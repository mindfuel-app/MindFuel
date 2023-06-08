import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function usePasswordToggle() {
  const [visible, setVisibility] = useState(false);

  const inputType = visible ? "text" : "password";

  const Icon = visible ? (
    <FaEyeSlash onClick={() => setVisibility(false)} />
  ) : (
    <FaEye onClick={() => setVisibility(true)} />
  );

  return [inputType, Icon];
}
