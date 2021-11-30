import React, { useEffect, useState, useMemo, createContext } from 'react';
import api from '../../services/api';
import moment from 'moment';
import { Button, ButtonGroup, Alert, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Label, Input } from 'reactstrap';
import socketio from 'socket.io-client';
import './dashboard.css'
import MessagePage from '../messagesPage';
import MessageMultipleChoice from '../messageMultipleChoice';
import { RiDeleteBin2Line } from "@react-icons/all-files/ri/RiDeleteBin2Line"
import ReplyPage from '../messageMultipleChoice/replyPage';

//Dashboard will show all the events 
export default function Dashboard({ history }) {
    const [events, setEvents] = useState([]);
    const user = localStorage.getItem('user');
    const user_id = localStorage.getItem('user_id');
    const [rSelected, setRSelected] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false)
    const [messageHandler, setMessageHandler] = useState('');
    const [eventsRequest, setEventsRequest] = useState([])
    const [dropdownOpen, setDropDownOpen] = useState(false)
    const [eventRequestMessage, setEventRequestMessage] = useState('')
    const [eventRequestSuccess, setEventRequestSuccess] = useState(false)
    const [messagesRequest, setMessagesRequest] = useState([]);


    const toggle = () => setDropDownOpen(!dropdownOpen);

    useEffect(() => {
        getEvents()
    }, [])



    const socket = useMemo(
        () =>
            socketio.connect('https://rob-mern-event-app.herokuapp.com', { query: { user: user_id } }),
        [user_id]
    );

    useEffect(() => {
        socket.on('registration_request', data => setEventsRequest([...eventsRequest, data]));
    }, [eventsRequest, socket])


    useEffect(() => {
        socket.on('message_request', data => setMessagesRequest([...messagesRequest, data]));
    }, [messagesRequest, socket])


    const filterHandler = (query) => {
        setRSelected(query)
        getEvents(query)
    }

    const myEventsHandler = async () => {
        try {
            setRSelected('myevents')
            const response = await api.get('/user/events', { headers: { user } })
            setEvents(response.data.events)
        } catch (error) {
            history.push('/login');

        }

    }

    const getEvents = async (filter) => {

        try {
            const url = filter ? `/dashboard/${filter}` : '/dashboard';
            const response = await api.get(url, { headers: { user } })

            setEvents(response.data.events)
        } catch (error) {
            history.push('/login');
        }

    };

    const deleteEventHandler = async (eventId) => {
        try {
            await api.delete(`/event/${eventId}`, { headers: { user: user } });
            setSuccess(true)
            setMessageHandler('The event was deleted successfully!')
            setTimeout(() => {
                setSuccess(false)
                filterHandler(null)
                setMessageHandler('')
            }, 2500)

        } catch (error) {
            setError(true)
            setMessageHandler('Error when deleting event!')
            setTimeout(() => {
                setError(false)
                setMessageHandler('')
            }, 2000)
        }
    }



    const registrationRequestHandler = async (event) => {
        try {
            const response = await api.post(`/registration/${event.id}`, {}, { headers: { user } })
            setSuccess(true)
            setMessageHandler(`The request for the event ${event.title} was successfully!`)

            setTimeout(() => {
                setSuccess(false)
                filterHandler(null)
                setMessageHandler('')
            }, 2500)

        } catch (error) {
            setError(true)
            setMessageHandler(`The request for the event ${event.title} wasn't successfully!`)

            setTimeout(() => {
                setError(false)
                setMessageHandler('')
            }, 2000)
        }
    }

    const acceptEventHandler = async (eventId) => {
        try {
            await api.post(`/registration/${eventId}/approvals`, {}, { headers: { user } })
            setEventRequestSuccess(true)
            setEventRequestMessage('Event approved successfully!')
            removeNotificationFromDashboard(eventId)
            setTimeout(() => {
                setEventRequestSuccess(false)
                setEventRequestMessage('')
            }, 2000)

        } catch (err) {
            console.log(err)
        }
    }

    const rejectEventHandler = async (eventId) => {
        try {
            await api.post(`/registration/${eventId}/rejections`, {}, { headers: { user } })
            setEventRequestSuccess(true)
            setEventRequestMessage('Event rejected successfully!')
            removeNotificationFromDashboard(eventId)
            setTimeout(() => {
                setEventRequestSuccess(false)
                setEventRequestMessage('')
            }, 2000)

        } catch (err) {
            console.log(err)
        }
    }

    const removeNotificationFromDashboard = (eventId) => {
        const newEvents = eventsRequest.filter((event) => event._id !== eventId)
        setEventsRequest(newEvents)
    }

    const registrationCheck = async (event_id, indx) => {

        try {

            const response = await api.get(`registration/${event_id}/sent`, { headers: { user } })




            if (response.data.registration.length == 0) {

                document.getElementById(`id${indx}`).innerHTML = 'Registration Request'
                document.getElementById(`id${indx}`).style.backgroundColor = "#0275d8"

            } else {
                if (response.data.registration[0].approved == true) {
                    document.getElementById(`id${indx}`).innerHTML = 'Approved'
                    document.getElementById(`id${indx}`).style.backgroundColor = "#5cb85c"
                    document.getElementById(`id${indx}`).style.display = 'false'

                } else {
                    if (response.data.registration[0].approved == false) {
                        document.getElementById(`id${indx}`).innerHTML = 'Rejected'
                        document.getElementById(`id${indx}`).style.backgroundColor = "#d9534f"
                    } else {
                        document.getElementById(`id${indx}`).innerHTML = 'Pending..'
                        document.getElementById(`id${indx}`).style.backgroundColor = "#d9534f"
                    }
                }

            }
        } catch (error) {
            console.log(error)
        }

    }

    

    //I stopped here, will continue from here latter

    return (
        <>

            <ul className="notifications">
                {eventsRequest.map(request => {

                    return (
                        <li key={request._id}>
                            <div>
                                <strong>{request.user.email} </strong> is requesting to register to your Event <strong>{request.event.title}</strong>
                            </div>
                            <ButtonGroup>

                                <Button color="secondary" onClick={() => { acceptEventHandler(request._id) }}>Accept</Button>
                                <Button color="danger" onClick={() => { rejectEventHandler(request._id) }}>Reject</Button>
                            </ButtonGroup>
                        </li>
                    )
                })}

            </ul>

            <ul className="notifications">
                {messagesRequest.map(request => {

                    return (
                        <li key={request._id}>
                            <div>
                                <div> <strong>{request.event.title} </strong> </div>
                                {
                                    request.event.user===user_id?<ReplyPage
                                    user1={user} senderName={request.senderFirstName + " " + request.senderLastName} msgId={request._id}
                                    eventName={request.event.title}/>
                                    :<MessagePage user1={user} event1={request.event} senderName={request.senderFirstName + " " + request.senderLastName}/>
                                }
                               
                               
                            </div>
                            
                               
                           
                        </li>
                    )
                })}

            </ul>
            {eventRequestSuccess ? <Alert color="success"> {eventRequestMessage}</Alert> : ""}
            <div className="filter-panel">
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle color="primary" caret>
                        Filter
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => filterHandler(null)} active={rSelected === null} >All Events</DropdownItem>
                        <DropdownItem onClick={myEventsHandler} active={rSelected === 'myevents'} >My Events</DropdownItem>
                        <DropdownItem onClick={() => filterHandler("Musical_event")} active={rSelected === 'Musical_event'} >Musical Event</DropdownItem>
                        <DropdownItem onClick={() => filterHandler("Sport")} active={rSelected === 'Sport'} >Sport</DropdownItem>
                        <DropdownItem onClick={() => filterHandler("Ceremony")} active={rSelected === 'Ceremony'} >Ceremony</DropdownItem>
                        <DropdownItem onClick={() => filterHandler("Family_Gathering")} active={rSelected === 'Family_Gathering'} >Family Gathering</DropdownItem>
                        <DropdownItem onClick={() => filterHandler("Demonstration")} active={rSelected === 'Demonstration'} >Demonstration</DropdownItem>
                        <DropdownItem onClick={() => filterHandler("Fashion_Event")} active={rSelected === 'Fashion_Event'} >Fashion Event</DropdownItem>
                        <DropdownItem color="primary" onClick={() => filterHandler('Other')} active={rSelected === 'Other'} >Other</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

            </div>
            <ul className="events-list">
                {events.map((event, indx) => (
                    <li key={event._id}>
                        <header style={{ backgroundImage: `url(${event.thumbnail_url})` }}>
                            {event.user === user_id ? <div><Button color="danger" size="sm" onClick={() => deleteEventHandler(event._id)}><RiDeleteBin2Line /></Button></div> : ""}

                            {user_id === event.user ? <MessageMultipleChoice user1={user} event1={event} /> : <MessagePage  buttonId={"true"} user1={user} event1={event} />}
                        </header>
                        <strong>{event.title}</strong>
                        <span>Event Date: {moment(event.date).format('l')}</span>
                        <span>Event Price: {parseFloat(event.price).toFixed(2)}</span>
                        <span>Event Description: {event.description}</span>
                        {console.log(registrationCheck(event._id, indx))}
                        <Button className='registration-button' id={`id${indx}`} onClick={() => registrationRequestHandler(event)}>Registration </Button>

                    </li>
                ))}
            </ul>

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
        </>
    )
}