import { useState } from 'react'

import {Form, Container, Button} from 'react-bootstrap'

export function LogIn() {

    const validateForm = () => {

    }

    return (
        <>
            <Container>
                <h1> Log In </h1>
                <Form action='/api/users/login' method='post' onSubmit={validateForm}>
                    <Form.Group controlId='userName'>
                        <Form.Label> Name: </Form.Label>
                        <Form.Control className='sm w-50' type='text' required/>
                    </Form.Group>
                    <Form.Group controlId='userPassword'>
                        <Form.Label> Password: </Form.Label>
                        <Form.Control className='sm w-50' type='password' required/>
                    </Form.Group>
                    <Button type='submit' className=''> Log In </Button>
                </Form>
                <hr></hr>
                <a href='/signup'> Create Account </a>
            </Container>
        </>
    )
}