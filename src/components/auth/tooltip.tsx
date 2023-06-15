import { Tooltip } from "@mui/material";
import { BsQuestionCircleFill } from "react-icons/bs";
import { Button } from "../ui/button";

export default function HoverTooltip() {
  return (
    <Tooltip title={"Hola"}>
      <div>Hola2</div>
    </Tooltip>
  );
}
