import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Alert, Toast, ToastHeader, ToastBody } from 'reactstrap';
import api from '../../services/api';
import moment from 'moment';
import './style.css'
import { MdOpenInNew } from "@react-icons/all-files/md/MdOpenInNew"
import { FiDelete } from "@react-icons/all-files/fi/FiDelete"



const ReplyPage = (props) => {
    const {
        buttonLabel,
        className
    } = props;

    const [modal, setModal] = useState(false);
    const [messageHandler, setMessageHandler] = useState('');
    const [messageText, setMessageText] = useState('')
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [messagesList, setMessagesList] = useState([]);




    const user = props.user1
    const userId = localStorage.getItem('user_id')

    const toggle = () => setModal(!modal);

    useEffect(() => {
        getConversation();
    }, [])

    const textMessageHandler = async (messageId) => {
        try {

            await api.post(`/replymessage/${messageId}`, { messageText }, { headers: { user } })
            setSuccess(true)
            setMessageHandler(`The Message has been sent successfully!`)
            setTimeout(() => {
                setSuccess(false)
                setMessageHandler('')
                toggle()

            }, 2500)

        } catch (error) {
            setError(true)
            console.log(error)
            setMessageHandler(`failed to send the message!`)

            setTimeout(() => {
                setError(false)
                setMessageHandler('')
            }, 2000)
        }
    }

    const getConversation = async () => {
        try {
            const response = await api.get(`/conversationowner/${props.msgId}`, { headers: { user } })
            const sortedResponse = response.data.sort((a, b) => {
                return moment(a.date).diff(b.date);
            });
            setMessagesList(sortedResponse)
            console.log('check from here')
            console.log(sortedResponse)
        } catch (error) {

        }

    }
    const deleteMessage = async (messageId, senderUserId) => {
        debugger;
        if (senderUserId !== userId) {
            return "message can't be deleted"
        }
        try {
            await api.delete(`/message/${messageId}`, { headers: { user } })
            removeMessageFromList(messageId)
            setSuccess(true)
            setMessageHandler(`The Message has been deleted successfully!`)
            removeMessageFromList(messageId)
            setTimeout(() => {
                setSuccess(false)
                setMessageHandler('')
                toggle()

            }, 2500)

        } catch (error) {
            setError(true)
            console.log(error)
            setMessageHandler(`failed to delete the message!`)

            setTimeout(() => {
                setError(false)
                setMessageHandler('')
            }, 2000)
        }
    }
    const removeMessageFromList = (messageId) => {
        const newMessagesList = messagesList.filter((message) => message._id !== messageId)
        setMessagesList(newMessagesList)
    }

    return (
        <div >

            <div>
                <strong>{props.senderName} </strong> sent you a message.
                <Button className='open_button' size='sm' color="success" onClick={toggle}><MdOpenInNew /> </Button>
            </div>






            <Modal scrollable={true} isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>{props.senderName}</ModalHeader>

                <ModalBody >
                    <ul className="events">
                        {messagesList.map(message => (
                            <div >
                                <Toast isOpen={modal} >
                                    <ToastHeader >
                                        <p onDoubleClick={() => { deleteMessage(message._id, message.senderUserId) }} >{message.senderFirstName} {"  "}{message.senderLastName}</p>




                                    </ToastHeader>
                                    <ToastBody >
                                        {message.messageText}
                                    </ToastBody>
                                </Toast>


                            </div>

                        ))}
                    </ul>


                </ModalBody>
                <ModalFooter>
                    <Label for="exampleText">Text Area</Label>
                    <Input type="textarea" name="text" id="exampleText" onChange={(evt) => { setMessageText(evt.target.value) }} />
                    <Button color="primary" onClick={() => textMessageHandler(props.msgId)}>Send</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
                {

                    error ? (
                        <Alert className="event-validation" color="danger"> {messageHandler} </Alert>
                    ) : ""
                }
                {
                    success ? (
                        <Alert className="event-validation" color="success"> {messageHandler}</Alert>
                    ) : ""
                }
            </Modal>

        </div>
    );
}

export default ReplyPage;