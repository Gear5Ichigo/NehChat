import { Overlay, Popover } from "react-bootstrap";

export default function ReactionsPopover({}) {
    return (
        <Overlay>
            <Popover
            placement="top"
            show={false}
            >
                <Popover.Body>

                </Popover.Body>
            </Popover>
        </Overlay>
    )
}