import React, { useState, useContext } from 'react';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../user-context'
import MyRegistrations from '../pages/myRegistrations';

const TopNav = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

    const [collapsed, setCollapsed] = useState(true);
    const toggleNavbar = () => setCollapsed(!collapsed);

    const logoutHandler = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('user_id')
        setIsLoggedIn(false)
    }

    return isLoggedIn ? 
        <div>
            <Navbar color="faded" light>
                <NavbarToggler onClick={toggleNavbar} />
                <Link to="/login" onClick={logoutHandler}>Logout</Link>
                <Collapse isOpen={!collapsed} navbar>
                    <Nav navbar>
                        <NavItem>
                            <Link to="/events">Events</Link>
                        </NavItem> <br/>
                        <NavItem>
                            <Link to="/">Dashboard</Link>
                        </NavItem><br/>
                        <NavItem>
                            <Link to="/myregistrations">My Registrations</Link>
                        </NavItem><br/>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    : ""
}

export default TopNav;