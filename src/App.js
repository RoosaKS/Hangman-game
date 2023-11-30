import './App.css';
import HangingTree from './components/HangingTree';
import { Toolbar, Typography } from '@mui/material';
 

function App() {
  return (
    <div className="App">
      <Toolbar className="toolbar">
        <Typography variant='h3'>Hangman</Typography>
      </Toolbar>
      <HangingTree/>
    </div>
  );
}

export default App;
