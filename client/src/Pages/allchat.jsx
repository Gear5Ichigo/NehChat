import { useEffect, useState, useRef } from "react";
import io from 'socket.io-client'

import { Form, Popover, Overlay, Button, Image } from "react-bootstrap";
import "../css/allchat.css"
import basic from "../../public/34AD2.jpg"

const socket = io('http://:8000', {
    transports: ['websocket'],
    autoConnect: false, 
    withCredentials: true, 
})

export function AllChat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [fileUpload, setFileUpload] = useState(null);
    const [showPopover, setShowPopover] = useState(false);
    const [popoverTarget, setPopoverTarget] = useState(null);

    const ref = useRef(null);

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
        authfetch();

        //

        // document.addEventListener('click', clickOutside )

        /**
         * Socket.IO stuff below
         */

        socket.on("connect_error", (err) => {
            console.log(`${err}`)
        });
        socket.connect();
        socket.on('connect', () => {
            console.log("someone joined")
        });
        socket.on('message', data => {
            setMessages((messages)=>[...messages, data]);
            window.scrollTo(0, document.body.scrollHeight);
        });

        return () => {
            document.removeEventListener('click', clickOutside)
            //
            socket.off('message');
            socket.off('connect');
            socket.disconnect();
        }
    }, []);

    const checkMessageContinuity = (data, index) => {
        const previous = messages[index-1];
        return (  (index==0||previous.user.username!==data.user.username) || data.dateTime.total>previous.dateTime.total+60000  );
    }

    const clickOutside = (ev) => {
        if (ref.current && !ref.current.contains(ev.target) && showPopover ) {
            
            setShowPopover(false);
        }
        console.log(showPopover)
    }

    const messageSubmit = (event) => {
        event.preventDefault();
        if (message.length>0 || fileUpload) {
            console.log(fileUpload)
            socket.emit('message', {message: message, fileUpload: fileUpload, date: Date.now() });
            setMessage(''); setFileUpload()
        }
    }
    
    return (
        <>
            <ul style={ {listStyle: "none"} } on>
                {messages.map((data, index) =>
                <li key={index} className={checkMessageContinuity(data, index)? "d-flex mt-2" : "d-flex"}>
                    {checkMessageContinuity(data, index)? (
                        <div className="pfp">
                            <Image src={basic} roundedCircle fluid />
                        </div>
                    ) : ( <div style={ {width:"3.1em"} }></div> )}
                    <div className="message-content" onClick={ event => {setShowPopover(!showPopover); setPopoverTarget(event.target)} }>
                        {checkMessageContinuity(data, index)? (
                            <div className="message-content-head">
                                <b className="message-content-head-username">{data.user.username}</b>
                                <small> {`${data.dateTime.month+1}/${data.dateTime.day}/${data.dateTime.year}`}
                                </small> <small> {`${data.dateTime.hour}:${data.dateTime.minute}:${data.dateTime.second}`} XM </small>
                            </div>
                        ) : (<></>)}                        
                        <div className="message-conetent-body"> {data.message} </div>
                        <div className="message-content-footer">
                            <small>reactions here lol</small>
                        </div>
                    </div>
                </li>)}
            </ul>
            <Overlay show={showPopover} target={popoverTarget} placement="top" ref={ref} >
                <Popover>
                    <Popover.Body> Emoji1 | Emoji2 | Emoji3 </Popover.Body>
                </Popover>
            </Overlay>
            <Form onSubmit={messageSubmit} style={ { bottom: 0, position: "fixed"} } className="d-flex w-100">
                <Form.Control type="file" className="" onChange={ event => setFileUpload(event.target.files[0])} />
                <Form.Control type="text" maxLength={200} value={message} onChange={ event => setMessage(event.target.value) } />
                <Form.Control type="submit" style={ {width: "15.25%", fontSize: "1em"} } value="Submit" />
            </Form>
        </>
    )
}