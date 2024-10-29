import { useEffect, useState } from "react";
import io from 'socket.io-client'

import { Form, Button } from "react-bootstrap";

const socket = io('http://10.40.0.251:8000', {
    transports: ["websocket"],
    autoConnect: false,
})

export function AllChat() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    useEffect( () => {

        const authfetch = async () => {
            await fetch('/api/authenticate')
            .then(res => res.json() )
            .then(
                data => {
                    if (!data.res) window.location.href = '/';
                }
            ) // on page load
        }
        authfetch()

        socket.on("connect_error", (err) => {
            console.log(`${err}`)
        })

        socket.connect()

        socket.on('connect', () => {
            console.log("joe joined")
        })
        
        socket.on('message', (msg) => {
            setMessages((messages)=>[...messages, msg])
        })

        return () => {
            socket.off('message');
            socket.off('connect');
            socket.disconnect();
        }
    }, [])

    const messageSubmit = (event) => {
        event.preventDefault();
        socket.emit('message', message)
        setMessage('');
    }
    
    return (
        <>
            <ul style={ {listStyle: "none"} }>
                {messages.map((message, index) => <li key={index}> {message.msg} </li>)}
            </ul>
            <Form onSubmit={messageSubmit}> 
                <Form.Control type="text" maxLength={200} value={message} onChange={ event => setMessage(event.target.value) } />
            </Form>
        </>
    )
}