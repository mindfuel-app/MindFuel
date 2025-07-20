import { ClickAwayListener, Tooltip, Grow } from "@mui/material";
import { useState } from "react";

export default function HoverTooltip({
  information,
  element,
}: {
  information: string;
  element: JSX.Element;
}) {
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
          title={information}
          arrow
          placement="top"
        >
          <button
            className="no-highlight flex items-center"
            onClick={() => setOpen(true)}
          >
            {element}
          </button>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
}
