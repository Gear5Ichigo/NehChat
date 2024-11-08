import { useEffect, useState, useRef } from "react";
import io from 'socket.io-client'

import { Form, Popover, Overlay, Button, Image, Modal, ListGroup, Card } from "react-bootstrap";
import "../css/allchat.css"
import basic from "/src/assets/basic.jpg"

const socket = io('http://:8000', {
    transports: ['websocket'],
    autoConnect: false, 
    withCredentials: true, 
})

export function AllChat() {
    const [clientUser, setClientUser] = useState();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [usersTyping, setUsersTyping] = useState(''); const [showTyping, setShowTyping] = useState('none');
    const [fileUpload, setFileUpload] = useState(null); const [fileField, setFileField] = useState('');
    const [showPopover, setShowPopover] = useState(false);
    const [popoverTarget, setPopoverTarget] = useState(null);
    const [showModal, setShowModal] = useState(false); const [modalBodyText, setModalBodyText] = useState('');
    const [showControlPanel, setShowControlPanel] = useState(false);
    const [panelTarget, setPanelTarget] = useState();
    const [panelCurrentTarget, setPanelCurrentTarget] = useState();
    const [censorIndex, setCensorIndex] = useState();

    const ref = useRef(null);
    const ref2 = useRef(null);

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
        socket.on('client connect', (user) => {
            setClientUser(user);
        })
        socket.on('user connected', (allmessages, allusers) => {
            setMessages(allmessages);
        });
        socket.on('user typing', (all) => {
            if (all.length < 7) {
                let addition = '';
                all.forEach(u => {
                    let endstr = ', ';
                    if (all.indexOf(u)==all.length-1) endstr=' ';
                    if (all.indexOf(u)==all.length-2) endstr=', and '
                    addition+=u.username+endstr;
                });
                setUsersTyping(addition+"typing . . .")
            } else setUsersTyping("Several people are typing . . .")
            if (all.length > 0) { setShowTyping("block") } else setShowTyping("none");
        })
        socket.on('message', data => {
            const messageContainer = document.querySelector("#messages-container")
            // setMessages((messages)=>[...messages, data]);
            setMessages(data);
            setTimeout(() => {
                messageContainer.scrollTop = messageContainer.scrollHeight
            }, )
        });

        return () => {
            document.removeEventListener('click', clickOutside)
            //
            socket.off('message');
            socket.off('user typing');
            socket.off('user not typing');
            socket.off('user connected');
            socket.off('client connect');
            socket.off('admin censor')
            socket.disconnect();
        }
    }, []);

    useEffect(()=>{

        socket.on('admin censor', (updatedMessages) => {
            setMessages(updatedMessages);
        })

        return () => {
            socket.off('admin censor')
        }
    }, [messages])

    const checkMessageContinuity = (data, index) => {
        const previous = messages[index-1];
        return (  (index==0||previous.user.username!==data.user.username) || data.dateTime.total>previous.dateTime.total+60000  );
    }

    const isPingMsg = (data, index) => {
        const continous = checkMessageContinuity(data, index)? "d-flex mt-2" : "d-flex";
        if (data.pingUsers) {
            return (data.pingUsers.username===clientUser.username) ? (continous+" at-user-highlight") : (continous);
        }
        return continous;
    }

    const addUpload = (upload) => {
        if (upload) {
            const url = "/src/assets/uploads/"+upload.name;
            if (upload.type.includes("image")) {
                return (
                <div className="my-2"> <Image style={{maxHeight:"18rem"}} src={url} alt={upload.name} fluid /> </div>
                )
            } else if (upload.type.includes("video")) {
                console.log(upload.type)
                return (
                    <div className="my-2">
                        <video style={{maxHeight:"18rem"}} controls>
                            <source src={url} type={upload.type==="video/x-matroska"?"video/mp4":upload.type} />
                        </video>
                    </div>
                )
            } else return (
                <a href={url}> {upload.name} </a>
            )
        }
        return (<></>)
    }

    const clickOutside = (ev) => {
        if (ref.current && !ref.current.contains(ev.target) && showPopover ) {
            
            setShowPopover(false);
        }
        console.log(showPopover)
    }

    const closeModal = () => setShowModal(false);

    const messageSubmit = (event) => {
        event.preventDefault();
        socket.emit("user not typing")
        let fileItem = null;

        if (fileUpload) {
            if (fileUpload.size > 50000*1000) {
                setShowModal(true); setModalBodyText(`File exceeds limit <b> 50MB </b>`)
                return
            } else fileItem = {name: fileUpload.name, data: fileUpload, type: fileUpload.type} ;
        }

        if (message.length > 0 || fileUpload) {
            socket.emit('message', {message: message, fileItem: fileItem, date: Date.now() });
            setMessage(''); setFileUpload(null); setFileField('');
        }
    }

    const handleTyping = (event) => {
        setMessage(event.target.value);
        if (event.target.value.length < 200 ) {
            if (event.target.value !== '') {
                socket.emit("user typing");
            } else socket.emit("user not typing");
        }
    }

    const messageControlPanel = (event) => {
        event.preventDefault();
        setShowControlPanel(true);
        setPanelTarget(event.target);
        setPanelCurrentTarget(event.currentTarget)
    }
    
    const userReplyClick = () => {
        const n = panelCurrentTarget.querySelector(".message-content-head-username");
        setMessage(`@${n.innerText} ${message} `);
        setShowControlPanel(false);
        document.querySelector("form > input[type='text']").focus();
    }

    const adminCensorClick = () => {
        socket.emit('admin censor', panelCurrentTarget.dataset.index); setShowControlPanel(false)
    }


    return (clientUser? (
        <div className="position-absolute bottom-0 w-100" >
            <div style={ {maxHeight:"100vh"} } className="overflow-y-scroll" id="messages-container">
                <ul style={ {listStyle: "none", padding:0} } className="" >
                    <li id="welcome-banner"> <h2 className="py-5"> Welcome to All CHAT </h2> </li>
                    {messages.map((data, index) =>
                    <li id={`user_message_${index}`} data-index={index} key={index} className={ isPingMsg(data, index) }
                    onContextMenu={messageControlPanel}
                    ref={ref2}
                    >
                        
                        {checkMessageContinuity(data, index)? (
                            <div className="pfp">
                                <Image src={"/src/assets/"+data.user.pfp} alt="profile_pic" roundedCircle fluid />
                            </div>
                        ) : ( <div style={ {width:"2.5em"} }></div> )}

                        <div className="message-content" >
                            {checkMessageContinuity(data, index)? (
                                <div className="message-content-head">
                                    <b className="message-content-head-username" style={{color:data.user.color}}>{data.user.username}</b>
                                    <small> {`${data.dateTime.month+1}/${data.dateTime.day}/${data.dateTime.year}`}</small>
                                    <small> {`${data.dateTime.hour}:${data.dateTime.minute}:${data.dateTime.second}`} XM </small>
                                </div>
                            ) : (<></>)}

                            <div className="message-conetent-body">
                                {addUpload(data.upload)}
                                <div> {data.message} </div>
                            </div>
                            <div className="message-content-footer">
                                {/* <small>reactions here lol</small> */}
                            </div>
                        </div>

                    </li>)}
                </ul>
            </div>

            <div className="" >
                <div style={ {display:showTyping} } > <b> {usersTyping} </b> </div>
                <Form onSubmit={messageSubmit} className="d-flex">
                    <Form.Control type="file" className="w-25" onChange={ event => {
                        setFileUpload(event.target.files[0])
                        setFileField(event.target.value)
                    }} value={fileField} />
                    <Form.Control type="text" maxLength={200} value={message} onChange={ handleTyping } />
                    <Form.Control type="submit" style={ {width: "15.25%", fontSize: "1em"} } value="Submit" />
                </Form>
            </div>

            <Overlay show={showPopover} target={popoverTarget} placement="top" ref={ref} >
                <Popover>
                    <Popover.Body> Emoji1 | Emoji2 | Emoji3 </Popover.Body>
                </Popover>
            </Overlay>

            <Overlay
                placement="top"
                show={showControlPanel}
                target={panelTarget}
            >
                <Card>
                    <Button size="sm" variant="danger" onClick={ () => setShowControlPanel(false) }>Close</Button>
                    <ListGroup>
                        <ListGroup.Item>
                            <Button size="lg" variant="link" onClick={userReplyClick}>Reply</Button>
                        </ListGroup.Item>
                    </ListGroup>
                    
                    { (clientUser && clientUser.roles.includes("admin")) ? (
                        <>
                            <Card.Title> Admin </Card.Title>
                            <ListGroup>
                                <ListGroup.Item>
                                    <Button size="lg" variant="link" onClick={adminCensorClick}> Censor </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </>
                    ) : (<></>)}
                </Card>
            </Overlay>

            <Modal
            show={showModal}
            onHide={closeModal}
            >
                <Modal.Header>
                    <Modal.Title> Oops... </Modal.Title>
                </Modal.Header>
                <Modal.Body dangerouslySetInnerHTML={{__html: modalBodyText}}/>
                <Modal.Footer>
                    <Button variant="primary" onClick={closeModal} > Close </Button>
                </Modal.Footer>
            </Modal>

        </div>
    ) : (<> <h1> Verifying . . . </h1> </>) )
}