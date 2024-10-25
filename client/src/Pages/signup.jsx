import {Form, Container, Button} from 'react-bootstrap'

export function SignUp() {
    return (
        <>
            <h1 className='mt-4' style={{textAlign: 'center'}}> Create Account </h1>
            <Container className='w-50 shadow mt-3 py-4 bg-body-tertiary'>
                <Form action='/api/users/register' method='post'>
                    <Form.Group controlId='userName'>
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type='text' name='username' required maxLength={20} autoComplete='off'/>
                    </Form.Group>
                    <Form.Group controlId='userPassword'>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type='password' name='password' required />
                    </Form.Group>
                    <Form.Group controlId='userConfirmPassword'>
                        <Form.Label> Confirm Password </Form.Label>
                        <Form.Control type='password' name='confirmpassword' required />
                    </Form.Group>
                    <Button type='submit' className='my-3'> Create </Button>
                </Form>
                <hr></hr>
                <a href='/'> Log In </a>
            </Container>
        </>
    );
}