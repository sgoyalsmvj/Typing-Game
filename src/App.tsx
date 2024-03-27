import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const quotes = [
  "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.",
  "There is nothing more deceptive than an obvious fact.",
  "I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.",
  "I never make exceptions. An exception disproves the rule.",
  "What one man can invent another can discover.",
  "Nothing clears up a case so much as stating it to another person.",
  "Education never ends, Watson. It is a series of lessons, with the greatest for the last.",
];

function App() {
  const [quoteElement, setQuoteElement] = useState<JSX.Element[]>([]);
  const [message, setMessage] = useState<string>("");
  const [typedValue, setTypedValue] = useState<string>("");
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const [words, setWords] = useState<string[]>([]);
  const [inputError, setInputError] = useState<boolean>(false);

  console.log(inputError);
  useEffect(() => {
    const spanWords = words.map((word, index) => (
      <span key={index} className={index === wordIndex ? "highlight" : ""}>
        {word}{" "}
      </span>
    ));
    setQuoteElement(spanWords);
  }, [words, wordIndex]);

  const startGame = () => {
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    const newWords = quote.split(" ");
    setWords(newWords);
    setWordIndex(0);
    setStartTime(Date.now());
    setTypedValue("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    const currentWord = words[wordIndex];
    if (typedValue === currentWord && wordIndex === words.length - 1) {
      const elapsedTime = new Date().getTime() - startTime;
      setMessage(
        `Congratulations! You finished in ${elapsedTime / 1000} seconds.`
      );
      setTypedValue(""); // Clear input field
    } else if (typedValue.endsWith(" ") && typedValue.trim() === currentWord) {
      setTypedValue("");
      setWordIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // Highlight next word
        setQuoteElement((prevQuoteElement) => {
          const updatedQuoteElement = [...prevQuoteElement];
          if (nextIndex < words.length) {
            updatedQuoteElement[nextIndex] = React.cloneElement(
              updatedQuoteElement[nextIndex],
              { className: "highlight" }
            );
          }
          return updatedQuoteElement;
        });
        return nextIndex;
      });
    } else if (currentWord?.startsWith(typedValue)) {
      setInputError(false);
    } else {
      setInputError(true);
    }
  }, [typedValue, words, wordIndex, startTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedValue(e.target.value);
  };

  return (
    <>
      <h1>Typing game!</h1>
      <p>
        Practice your typing skills with a quote from Sherlock Holmes. Click
        **start** to begin!
      </p>
      <div id="quote">{quoteElement}</div>
      <p id="message">{message}</p>
      <div>
        <input
          ref={inputRef}
          type="text"
          aria-label="current word"
          id="typed-value"
          onChange={handleChange}
          value={typedValue}
          className={!inputError ? "" : "error"}
        />
        <button onClick={startGame} type="button" id="start">
          Start
        </button>
      </div>
    </>
  );
}

export default App;
