import { Accordion, AccordionBody, ListGroup, Overlay} from "react-bootstrap";

export default function UserActionsList({target, show, clientUser, adminCensorFunc, closeFunc, replyFunc}) {
    return (<>
        <Overlay
        popperConfig={{}}
        target={target}
        show={show}
        placement="top"
        >
            <ListGroup>
                <ListGroup.Item action onClick={closeFunc} className="bg-danger text-light"> X </ListGroup.Item>
                <ListGroup.Item action onClick={replyFunc}> Reply </ListGroup.Item>
                { (clientUser && clientUser.roles.includes("admin"))? (
                <>
                    <Accordion as={ListGroup.Item} style={{margin: 0, padding: 0}}>
                        <Accordion.Header> Admin </Accordion.Header>
                        <AccordionBody as={ListGroup.Item}
                            action onClick={adminCensorFunc}
                        > Censor </AccordionBody>
                    </Accordion>
                </>
                ) : (<></>) }
            </ListGroup>
        </Overlay>
    </>)
}