import { Tooltip } from "@mui/material";
import { BsQuestionCircleFill } from "react-icons/bs";
import { useState } from "react";

export default function HoverTooltip() {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div>
      <BsQuestionCircleFill
        onClick={() => setShowTooltip(!showTooltip)}
        className="relative"
      />

      {showTooltip && (
        <div className="absolute z-10 mt-1 rounded bg-gray-700 p-2 font-normal text-white">
          Tu nombre de usuario te identifica y es el que veran tus amigos en la
          app
        </div>
      )}
    </div>
  );
}
