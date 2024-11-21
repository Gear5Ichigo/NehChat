import { Modal, Button } from "react-bootstrap";

export default function AlertModal({show, onHide, modalBodyText}) {
    return (<>
        <Modal
        show={show}
        onHide={onHide}
        >
            <Modal.Header>
                <Modal.Title> Oops... </Modal.Title>
            </Modal.Header>
            <Modal.Body dangerouslySetInnerHTML={{__html: modalBodyText}}/>
            <Modal.Footer>
                <Button variant="primary" onClick={onHide} > Close </Button>
            </Modal.Footer>
        </Modal>
    </>)
}