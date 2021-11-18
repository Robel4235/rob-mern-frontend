import React, { useState,useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,ButtonGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ReplyPage from './replyPage';
import './style.css'
import {BsFillChatSquareFill} from "@react-icons/all-files/bs/BsFillChatSquareFill"
const MessageMultipleChoice = (props) => {
    const {
        buttonLabel,
        className
    } = props;

    const [modal, setModal] = useState(false);
    const [messagesList, setMessagesList] = useState([]);
    const toggle = () => setModal(!modal);
    const user = props.user1

    useEffect(() => {
        getListMessageRequests()
    }, [])


    const getListMessageRequests = async () => {
        try {
            const response = await api.get(`/messages/${props.event1.id}`, { headers: { user } })
            setMessagesList(response.data)
            console.log(response.data)

        } catch (error) {

        }

    }
    
    return (
        <div>
           
            <Button className='messagebutton' size="sm" onClick={toggle}>  <BsFillChatSquareFill /></Button>
            <Modal scrollable={true} isOpen={modal} toggle={toggle} className={className }>
                <ModalHeader toggle={toggle}>Messages</ModalHeader>
                <ModalBody>
                <ul  className="notifications">
                {messagesList.map(msg => {
                    return (
                        <li key={msg._id}>
                            <div>
                            <ReplyPage buttonId={"true"} user1={user} senderName={msg.senderFirstName + " " + msg.senderLastName} msgId={msg._id}
                                eventName={msg.event.title}/>
                            </div>           
                        </li>
                    )
                })}

            </ul>
                </ModalBody>
                <ModalFooter>
                    
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default MessageMultipleChoice;