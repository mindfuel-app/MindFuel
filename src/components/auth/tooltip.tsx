import { ClickAwayListener, Tooltip, Grow } from "@mui/material";
import { BsQuestionCircleFill } from "react-icons/bs";
import { useState } from "react";

export default function HoverTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={() => setOpen(false)}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          TransitionComponent={Grow}
          TransitionProps={{ timeout: 200 }}
          title="Tu nombre de usuario te identifica y es el que veran tus amigos en la
          app"
          arrow
          placement="top"
        >
          <button
            className="no-highlight flex items-center"
            onClick={() => setOpen(true)}
          >
            <BsQuestionCircleFill />
          </button>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
}
