import {Form, Container, Button} from 'react-bootstrap'

export function SignUp() {
    return (
        <>
            <Container className='w-50 shadow'>
                <Form action='/api/users/create'>
                    <Form.Group controlId='userName'>
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type='text' required maxLength={20} autoComplete='off'/>
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type='password'/>
                    </Form.Group>
                    <Button type='submit'> Create </Button>
                </Form>
            </Container>
        </>
    );
}