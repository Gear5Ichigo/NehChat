import { Accordion, ListGroup, ListGroupItem } from "react-bootstrap";

export default function SideMenu() {
    return (
        <div style={{width:"280px"}} className="shadow">
            <ListGroup>
                <ListGroupItem action> All Chat </ListGroupItem>
                <Accordion as={ListGroup.Item} style={{margin: 0, padding: 0}}>
                    <Accordion.Header> Arcade 🕹 </Accordion.Header>
                    <Accordion.Body as={ListGroup.Item} action href="/Sean-2048/2048/index.html"> 2048 </Accordion.Body>
                    <Accordion.Body as={ListGroup.Item} action > Midnight Motorist </Accordion.Body>
                </Accordion>
                <ListGroupItem action onClick={()=>{window.location.href ="/settings"}}> Settings </ListGroupItem>
                <ListGroupItem action> Log Out </ListGroupItem>
            </ListGroup>
        </div>
    )
}