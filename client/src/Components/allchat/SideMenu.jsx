import { Accordion, Form, ListGroup, ListGroupItem } from "react-bootstrap";

export default function SideMenu() {
    return (
        <div style={{width:"280px"}} className="shadow">
            <ListGroup variant="flush">
                <ListGroupItem action onClick={()=>{window.location.href ="/allchat"}}> All Chat </ListGroupItem>
                <Accordion as={ListGroup.Item} style={{margin: 0, padding: 0}}>
                    <Accordion.Header> Arcade 🕹 </Accordion.Header>
                    <Accordion.Body className="bg-info fw-bold" as={ListGroup.Item} action href="/arcade/2048/index.html"> 2048 </Accordion.Body>
                    <Accordion.Body className="bg-info fw-bold" as={ListGroup.Item} action href="/src/arcade/midnight-motorist/index.html"> Midnight Motorist </Accordion.Body>
                    <Accordion.Body className="bg-info fw-bold" as={ListGroup.Item} action href="/src/arcade/pizza/index.html"> Pizza </Accordion.Body>
                </Accordion>
                <ListGroupItem action onClick={()=>{window.location.href ="/settings"}}> Settings </ListGroupItem>
                <Form action="/api/users/logout" method="post">
                    <input type="submit" value={"Log Out"}
                    className="list-group-item list-group-item-action m-0 border border-top-0 border-end-0"
                    />
                </Form>
            </ListGroup>
        </div>
    )
}