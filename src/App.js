import React from 'react';
import './App.css';
import { Container } from 'reactstrap';
import Routes from './routes';
import { ContextWrapper } from './user-context';

function App() {
  return (
    <ContextWrapper>
      <Container>
        <h1>H-A-P</h1>
        <div className='content' >
          <Routes />
        </div>
      </Container>
    </ContextWrapper>

  );
}

export default App;
