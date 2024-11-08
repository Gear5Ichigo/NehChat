import { useState, useEffect } from "react";
import { Button, Container, Form, Image } from "react-bootstrap";

export function Settings() {
    const [user, setUser] = useState();
    const [color, setColor] = useState('#000000');
    const [image, setImage] = useState();

    useEffect(()=>{
        const auth = async () => {
            fetch("/api/users/get_user")
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser(data.user); setColor(data.user.color);
                } else window.location.href = "/?login_fail=true"
            })
        }
        auth();
        return () => {

        }
    }, [])

    const formHandle = (event) => {
        console.log(color);
    }

    return user? (
        <>
            <Container>
                <Button size="lg" variant="link" onClick={()=>{window.location.href="/dashboard"}}>Back</Button>
                <Form action="/api/users/update" method="post" onSubmit={formHandle}>
                    <Form.Group controlId="user_pfp">
                        <Form.Label> Profile Picture </Form.Label>
                        <Form.Control type="file" name="profile_picture"/>
                        <div className="d-flex">
                            <div>
                                <h2> Current </h2>
                                <div><Image src={"/src/assets/"+user.pfp} alt="current" fluid/></div>
                            </div>
                            <div>
                                <h2> Preview </h2>
                                <div><Image src="" alt="preview" fluid/></div>
                            </div>
                        </div>
                    </Form.Group>

                    <Form.Group controlId="user_color">
                        <Form.Label> Color </Form.Label>
                        <Form.Control type="color" name="color" value={color} onChange={ event=>{setColor(event.target.value);console.log(event.target.value)} }/>
                    </Form.Group>

                    <Form.Control type="submit" />

                </Form>
            </Container>
        </>
    ) : (<h1> Verifying . . . </h1>)
}