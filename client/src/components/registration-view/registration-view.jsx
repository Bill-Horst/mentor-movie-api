import React, { useState } from 'react';
import './registration-view.scss';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

export function RegistrationView(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username, password);
        /* Send a request to the server for registration */
        /* then call props.onLoggedIn(username) */
        props.onRegistered(true);
    };

    return (
        <Container>
            <h1>New user registration page</h1>
            <Form>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Button variant="primary" type="button" onClick={handleSubmit}>Submit</Button>
            </Form>
        </Container>
    );
}