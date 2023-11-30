import './HangingTree.css';
import { useState } from "react";
import Button from '@mui/material/Button';
import Confetti from 'react-confetti';


function HangingTree() {
    const [randomWord, setRandomWord] = useState('');
    const [guessedWord, setGuessedWord] = useState('');
    const [errors, setErrors] = useState(0);
    const [wrongGuesses, setWrongGuesses] = useState([]);
    const qwertyKeyboard = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
      ];
    const [gameStarted, setGameStarted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const apiKey = process.env.REACT_APP_API_KEY;

    const getWord = () => {
        setWrongGuesses([]);
        setGameStarted(true);
        fetch('https://api.api-ninjas.com/v1/randomword', {
            method: 'GET',
            contentType: 'application/json',
            headers: {
                'X-Api-Key': apiKey
            }
            })
            .then(response => response.json())
            .then(data => {
                setRandomWord(data.word);
                setGuessedWord('_'.repeat(data.word.length));
                setErrors(0);
                setShowConfetti(false);
            })
            .catch(err => console.error(err))
            
    }

    const guessLetter = (letter) => {
        letter = letter.toLowerCase();
        if (randomWord.toLowerCase().includes(letter)) {
            const newGuessedWord = guessedWord.split('').map((char, index) => {
                if (randomWord[index].toLowerCase() === letter) {
                    return randomWord[index];
                } else {
                    return char;
                }
            }).join('');
            setGuessedWord(newGuessedWord);
        } else {
            setErrors(errors + 1);
            setWrongGuesses([...wrongGuesses, letter]);
        }
    }

    const hangmanImage = `images/Hangman${errors}.png`;

    const checkGameStatus = () =>{
        if (guessedWord === randomWord && guessedWord !== '') {
            setTimeout(() => {
                setShowConfetti(true);
            }, 100); 
            return <p>You Won!</p>;
        } else if (errors >= 8  && guessedWord !== '') {
            return <p>You Lost! The word was {randomWord}. Try Again</p>
        }
        return null;
    }

    const createLetterButtons = () => {
        return qwertyKeyboard.map((row, rowIndex) => (
            <div key={rowIndex}>
            {row.map((letter, index) => (
            <Button variant="outlined" color='success' disabled={errors >= 8} key={index} onClick={() => guessLetter(letter)}>{letter.toUpperCase()}</Button>
            ))}
        </div>
        ));
      }

      const displayWord = guessedWord.split('').join(' ');


    return (
      <div className="App">
        <div className="start">
        {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
          gravity={0.1}
          run={showConfetti}
        />
      )}
        {(!gameStarted || guessedWord === randomWord || errors >= 8) && (
            <Button onClick={getWord} variant="outlined" color='error'>
                {gameStarted ? 'Play Again' : 'Start'}
            </Button>
        )}
            {!gameStarted && <div style={{ marginBottom: '20px' }}></div>}
        </div>
        {gameStarted && <p>The word to guess: {displayWord}</p>}
        {checkGameStatus()}
        <div className="button-container">
            {createLetterButtons()}
        </div>
        
        {errors > 0 && <img src={hangmanImage} alt="Hangman" /> }
        <div className="wrong-guesses"> 
        {wrongGuesses.map((letter, index) => (
            <img key={index} src={`images/alphabet/${letter.toLowerCase()}.png`} alt={`Alphabet ${letter}`} style={{ width: '50px', height: '50px' }} />
        ))}
      </div>
    </div>
    );
  }




export default HangingTree;