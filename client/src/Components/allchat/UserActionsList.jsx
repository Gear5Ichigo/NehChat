import { Accordion, AccordionBody, ListGroup, Overlay} from "react-bootstrap";

export default function UserActionsList({target, currentTarget, show, clientUser,
        closeFunc,
        replyFunc,
        deleteFunc,
        adminCensorFunc,
        adminMuteFunc,
        adminBanFunc,
    }) {
    return (<>
        <Overlay
        popperConfig={{}}
        target={target}
        show={show}
        placement="top"
        >
            <ListGroup>
                <ListGroup.Item action onClick={closeFunc} className="bg-danger text-light text-center"> X </ListGroup.Item>
                <ListGroup.Item action onClick={replyFunc}> Mention </ListGroup.Item>
                <ListGroup.Item action onClick={replyFunc}> Reply </ListGroup.Item>
                { ( (clientUser && currentTarget) && (clientUser.username===currentTarget.dataset.user || clientUser.roles.includes("admin")) )? (
                    <ListGroup.Item action onClick={deleteFunc}> Delete </ListGroup.Item>
                ) : (<></>) }
                { (clientUser && clientUser.roles.includes("admin"))? (
                <>
                    <Accordion as={ListGroup.Item} style={{margin: 0, padding: 0}}>
                        <Accordion.Header> Admin </Accordion.Header>
                        <AccordionBody as={ListGroup.Item} action onClick={adminCensorFunc}> Censor </AccordionBody>
                        <AccordionBody as={ListGroup.Item} action onClick={adminMuteFunc}> Mute </AccordionBody>
                        <AccordionBody as={ListGroup.Item} action onClick={adminBanFunc}> Ban </AccordionBody>
                    </Accordion>
                </>
                ) : (<></>) }
            </ListGroup>
        </Overlay>
    </>)
}