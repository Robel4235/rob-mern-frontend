import React, { useState, useMemo,useEffect } from 'react';
import api from '../../services/api';
import { Alert, Container, Button, Form, FormGroup, Input, Label, DropdownItem, DropdownMenu, DropdownToggle, ButtonDropdown } from 'reactstrap';
import cameraIcon from '../../assets/camera.png'
import "./events.css";

export default function EventsPage({ history }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [thumbnail, setThumbnail] = useState(null)
    const [event, setEvent] = useState('Events')
    const [date, setDate] = useState('')
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [dropdownOpen, setOpen] = useState(false);
    const user = localStorage.getItem('user');

    const toggle = () => setOpen(!dropdownOpen);

    useEffect(() => {
        if (!user) {
            history.push('/login')
        }
    }, [])

    const preview = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null;
    }, [thumbnail])

    const submitHandler = async (evt) => {
        evt.preventDefault()

        const eventData = new FormData();

        eventData.append("thumbnail", thumbnail)
        eventData.append("event", event)
        eventData.append("title", title)
        eventData.append("price", price)
        eventData.append("description", description)
        eventData.append("date", date)


        try {
            if (title !== "" &&
                description !== "" &&
                price !== "" &&
                event !== "Events" &&
                date !== "" &&
                thumbnail !== null
            ) {
                await api.post("/event", eventData, { headers: {user} })
                setSuccess(true)
                setTimeout(() => {
                    setSuccess(false)
                    history.push("/")
                }, 2000)
            } else {
                setError(true)
                setTimeout(() => {
                    setError(false)
                }, 2000)
            }
        } catch (error) {
            Promise.reject(error);
            console.log(error);
        }
    }

    const theEventHandler = (event) => setEvent(event);

    console.log(event)
    return (
        <Container>
            <h2>Create your Event</h2>
            <Form onSubmit={submitHandler}>
                <div className="input-group">
                    <FormGroup>
                        <Label>Upload Image: </Label>
                        <Label id='thumbnail' style={{ backgroundImage: `url(${preview})` }} className={thumbnail ? 'has-thumbnail' : ''}>
                            <Input type="file" onChange={evt => setThumbnail(evt.target.files[0])} />
                            <img src={cameraIcon} style={{ maxWidth: "50px" }} alt="upload icon image" />
                        </Label>
                    </FormGroup>
                    <FormGroup>
                        <Label>Title: </Label>
                        <Input id="title" type="text" value={title} placeholder={'Event Title'} onChange={(evt) => setTitle(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Event description: </Label>
                        <Input id="description" type="text" value={description} placeholder={'Event Description'} onChange={(evt) => setDescription(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Event price: </Label>
                        <Input id="price" type="text" value={price} placeholder={'Event Price ??0.00'} onChange={(evt) => setPrice(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Event date: </Label>
                        <Input id="date" type="date" value={date} placeholder={'Event Price ??0.00'} onChange={(evt) => setDate(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                            <Button id="caret" value={event} disabled>{event}</Button>
                            <DropdownToggle caret />
                            <DropdownMenu>
                                <DropdownItem onClick={() => theEventHandler('Musical_event')}>Musical event</DropdownItem>
                                <DropdownItem onClick={() => theEventHandler('Sport')}>Sport</DropdownItem>
                                <DropdownItem onClick={() => theEventHandler('Ceremony')}>Ceremony</DropdownItem>
                                <DropdownItem onClick={() => theEventHandler('Family_Gathering')}>Family Gathering</DropdownItem>
                                <DropdownItem onClick={() => theEventHandler('Demonstration')}>Demonstration</DropdownItem>
                                <DropdownItem onClick={() => theEventHandler('Fashion_Event')}>Fashion Event</DropdownItem>
                                <DropdownItem onClick={() => theEventHandler('Other')}>Other</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                    </FormGroup>
                </div>
                <FormGroup>
                    <Button className="submit-btn">Submit</Button>
                </FormGroup>
                <FormGroup>
                    <Button className="secondary-btn" onClick={() => history.push("/")}>
                        Cancel
                    </Button>
                </FormGroup>
            </Form>
            {error ? (
                <Alert className="event-validation" color="danger"> Missing required information</Alert>
            ) : ""}
            {success ? (
                <Alert className="event-validation" color="success"> The event was created successfully!</Alert>
            ) : ""}
        </Container>
    )
}