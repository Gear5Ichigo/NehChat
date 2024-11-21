import { useEffect, useState, useRef } from "react";
import io from 'socket.io-client'

import { Form, Image } from "react-bootstrap";
import "../css/allchat.css"

import AlertModal from "../Components/allchat/AlertModal"
import ReactionsPopover from "../Components/allchat/ReactionsPopover"
import UserActionsList from "../Components/allchat/UserActionsList"
import SideMenu from "../Components/allchat/SideMenu";
import AllUsersInRoom from "../Components/allchat/AllUsersInRoom";

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
        socket.on('redirect', () => {
            window.location.href = "/";
        })
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
            socket.off('redirect');
            socket.off('message');
            socket.off('user typing');
            socket.off('user not typing');
            socket.off('user connected');
            socket.off('client connect');
            socket.off('admin censor');
            socket.disconnect();
        }
    }, []);

    useEffect(()=>{

        socket.on('update messages', (updatedMessages) => {
            setMessages(updatedMessages);
        })

        return () => {
            socket.off('update messages')
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
            const url = "/src/assets/uploads/chat/"+upload.name;
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
        if (!showControlPanel) {setShowControlPanel(true)}
        setPanelTarget(event.target);
        setPanelCurrentTarget(event.currentTarget)
    }
    
    const userReplyClick = () => {
        const n = panelCurrentTarget.dataset.user;
        setMessage(`@${n} ${message} `);
        setShowControlPanel(false);
        document.querySelector("form > input[type='text']").focus();
    }

    const adminCensorClick = () => {
        socket.emit('admin censor', panelCurrentTarget.dataset.index); setShowControlPanel(false)
    }

    const adminMuteClick = () => {
        socket.emit('admin mute')
    }

    const userDeleteClick = (index) => {
        socket.emit("delete message", panelCurrentTarget.dataset.index); setShowControlPanel(false)
    }

    return (clientUser? (
        <>
            <div className="d-flex" style={{height:"100vh"}}>
                <SideMenu />

                <div className="w-100" style={{alignSelf:"flex-end"}}>
                    <div className="overflow-y-auto position-relative" id="messages-container" style={{height:"100vh"}}>
                        <ul style={ {listStyle: "none", padding:0} } className=" w-100" >
                            <li id="welcome-banner"> <h2 className="py-5"> Welcome to All CHAT </h2> </li>
                            {messages.map((data, index) =>
                            <li id={`user_message_${index}`} className={ isPingMsg(data, index) }
                            key={index}
                            data-index={index}
                            data-user={data.user.username}
                            onContextMenu={messageControlPanel}
                            ref={ref2}
                            >
                                {checkMessageContinuity(data, index)? (
                                    <div style={{
                                        backgroundImage: `url(${"/src/assets/"+data.user.pfp})`,
                                    }} className="neh-avatar"></div>
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

                    <ReactionsPopover />

                    <UserActionsList
                    show={showControlPanel}
                    target={panelTarget} currentTarget={panelCurrentTarget}
                    clientUser={clientUser}
                    closeFunc={()=>{setShowControlPanel(false)}}
                    replyFunc={userReplyClick}
                    deleteFunc={userDeleteClick}
                    adminCensorFunc={adminCensorClick}
                    adminMuteFunc={adminMuteClick}
                    />

                    <AlertModal
                    show={showModal}
                    onHide={closeModal}
                    modalBodyText={modalBodyText}
                    />
                    
                </div>

                <AllUsersInRoom />

            </div>
        </>
    ) : (<> <h1> Verifying . . . </h1> </>) )
}