import axios from 'axios';

const api = axios.create({
    baseURL:'https://rob-mern-event-app.herokuapp.com'
})
export default api;