import { useState, useEffect } from "react";
import { Button, Container, Form, Image } from "react-bootstrap";

export function Settings() {
    const [user, setUser] = useState();
    const [color, setColor] = useState('#000000');
    const [file, setFile] = useState();
    const [preview, setPreview] = useState();
    const [imageError, setImageError] = useState();
    const [files, setFiles] = useState('[]')

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

    const formHandle = async (event) => {
        event.preventDefault();
        const filefield = event.target.querySelector("input[type='file']");
        const reader = new FileReader();
        reader.readAsDataURL(filefield.files[0])
        reader.onloadend = async function() {
            let base64data = reader.result;
            const split = base64data.split(',')
            const type = split[0].substring(split[0].indexOf('image'), split[0].indexOf(';'));
            console.log(type)
            await fetch('/api/users/update', {
                method: "POST",
                body: JSON.stringify({
                    color: color,
                    profile_picture: filefield.files[0].name,
                    blob: {
                        data: split[1],
                        type: type
                    }
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }
    }

    const handleProfilePicture = (event) => {
        setFiles(event.target.files)
        const selected = event.target.files[0]
        setFile(event.target.value);
        if (selected && selected.type.includes('image')) {
            const objectUrl = URL.createObjectURL(selected);
            setPreview(objectUrl);
            (selected.size > 20000*1000)? setImageError("File size is too large") : setImageError("looks good");
        } else {
            setImageError("Thats not an image"); event.target.value='';  event.target.files = []
        }
    }

    return user? (
        <>
            <Container>
                <Button size="lg" variant="link" onClick={()=>{window.location.href="/dashboard"}}>Back</Button>
                <Form onSubmit={formHandle}>
                    <Form.Group controlId="user_pfp">
                        <Form.Label> Profile Picture </Form.Label>
                        <Form.Control type="file" name="profile_picture" onChange={handleProfilePicture} />
                        <div className="d-flex">
                            <div>
                                <h2> Current </h2>
                                <div><Image src={"/src/assets/"+user.pfp} alt="current" fluid/></div>
                            </div>
                            <div>
                                <h2> Preview </h2>
                                <div><Image src={preview} alt="preview" fluid/></div>
                            </div>
                        </div>
                        <h3>{imageError}</h3>
                    </Form.Group>

                    <Form.Group controlId="user_color">
                        <Form.Label> Color </Form.Label>
                        <Form.Control type="color" name="color" value={color} onChange={ event=>{setColor(event.target.value);} }/>
                    </Form.Group>

                    <Form.Control type="submit" />

                </Form>
            </Container>
        </>
    ) : (<h1> Verifying . . . </h1>)
}