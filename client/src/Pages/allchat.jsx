import { useEffect, useState } from "react";
import io from 'socket.io-client'

import { Form, Button } from "react-bootstrap";

const socket = io('http://:8000', {
    transports: ['websocket'],
    autoConnect: false, 
    withCredentials: true, 
})

export function AllChat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);

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
            
        })
        
        socket.on('message', (msg) => {
            setMessages((messages)=>[...messages, msg]);
            window.scrollTo(0, document.body.scrollHeight);
        })

        return () => {
            socket.off('message');
            socket.off('connect');
            socket.disconnect();
        }
    }, [])

    const messageSubmit = (event) => {
        event.preventDefault();
        if (message.length>0) {
            socket.emit('message', message);
            setMessage('');
        }
    }
    
    return (
        <>
            <ul style={ {listStyle: "none"} }>
                {messages.map((message, index) =>
                <li key={index} className="d-flex">
                    <div> <img src="/basic.png" alt="profile_pic"/> </div>
                    <div>
                        <div> <b>{message.user.username}</b> <small> xx/xx/xxxx </small> </div>
                        <div> {message.msg} </div>
                        <div> <small> reactions here lol </small> </div>
                    </div>
                </li>)}
            </ul>
            <Form onSubmit={messageSubmit} style={ { bottom: 0, position: "fixed"} } className="d-flex">
                <Form.Control type="file" />
                <Form.Control type="text" maxLength={200} value={message} onChange={ event => setMessage(event.target.value) } />
                <Form.Control type="submit" className="w-25" />
            </Form>
        </>
    )
}