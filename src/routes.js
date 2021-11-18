import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/login/index';
import Dashboard from './pages/dashboard';
import Register from './pages/login/register';
import EventsPage from './pages/eventsPage';
import TopNav from './components/TopNav';
import MyRegistrations from './pages/myRegistrations';
import MessagePage from './pages/messagesPage';

export default function Routes() {
    return (
        <BrowserRouter>
            <TopNav />
            <Switch>
                <Route path='/' exact component={Dashboard} />
                <Route path='/login' exact component={Login} />
                <Route path='/register' exact component={Register} />
                <Route path='/events' exact component={EventsPage} />
                <Route path='/myregistrations' exact component={MyRegistrations} />
                <Route path='/messagespage' exact component={MessagePage} />
            </Switch>
        </BrowserRouter>
    )
}