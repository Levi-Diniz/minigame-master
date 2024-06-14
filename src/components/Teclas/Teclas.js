import React, { useState, useEffect, useCallback, useMemo } from "react";
import style from "./teclas.module.css";
import Modal from "../Modal/Modal";
import { Link } from "react-router-dom";
import errorSound from "./1.mp3";

export default function Jogo() {
    const [progress, setProgress] = useState(0);
    const [activeKeys, setActiveKeys] = useState([]);
    const [sequence, setSequence] = useState([]);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [timeUp, setTimeUp] = useState(false);
    const [show, setShow] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [level, setLevel] = useState(1);
    const [points, setPoints] = useState(() => {
        const savedPoints = localStorage.getItem("points");
        return savedPoints ? parseInt(savedPoints, 10) : 0;
    });
    const [highScore, setHighScore] = useState(() => {
        const savedHighScore = localStorage.getItem("highScore");
        return savedHighScore ? parseInt(savedHighScore, 10) : 0;
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [playErrorSound, setPlayErrorSound] = useState(false); 
    const [difficulty, setDifficulty] = useState("Facil");

    const difficultyLevels = useMemo(() => ["Facil", "Medio", "Dificil", "Impossivel"], []);
    const difficultyIntervals = useMemo(() => [80, 50, 40, 30], []);

    const showModal = () => {
        setShow(true);
    };

    const hideModal = () => {
        setShow(false);
        setErrorMessage("");
    };

    const restartGame = () => {
        setErrorMessage("");
        setShow(false);
        setGameOver(false);
        setLevel(1);
        setDifficulty(difficultyLevels[0]);
        generateRandomKeys(true);
    };

    const continueGame = () => {
        if (points >= 50) {
            setLevel((prevLevel) => prevLevel - 1);
            setShow(false);
            setGameOver(false);
            setPoints((prevPoints) => {
                const newPoints = prevPoints - 50;
                localStorage.setItem("points", newPoints);
                return newPoints;
            });
            generateRandomKeys(false);
        } else {
            setErrorMessage("Você não tem pontos suficientes para continuar.");
        }
    };

    useEffect(() => {
        const intervalTime = difficultyIntervals[difficultyLevels.indexOf(difficulty)];
        const timer = setTimeout(() => {
            if (progress < 100 && !gameOver) {
                setProgress(progress + 1);
            } else {
                setTimeUp(true);
                setGameOver(true);
                clearTimeout(timer);
                showModal();
            }
        }, intervalTime);

        return () => clearTimeout(timer);
    }, [progress, gameOver, difficulty, difficultyIntervals, difficultyLevels]);

    const generateRandomKeys = useCallback((isReset = false) => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "123456789";
        const allChars = letters + numbers;

        let newActiveKeys = [];
        let newSequence = [];
        for (let i = 0; i < 6; i++) {
            const randomChar = allChars.charAt(Math.floor(Math.random() * allChars.length));
            newActiveKeys.push(randomChar);
            newSequence.push(false);
        }
        setActiveKeys(newActiveKeys);
        setSequence(newSequence);
        setCurrentPosition(0);
        setTimeUp(false);
        setProgress(0);
        setGameOver(false);
        if (!isReset) {
            setLevel((prevLevel) => prevLevel + 1);
            setPoints((prevPoints) => {
                const newPoints = prevPoints + 10;
                localStorage.setItem("points", newPoints);


                return newPoints;
            });

            if (level > highScore) {
                setHighScore(level);
                localStorage.setItem("highScore", level); 
            }

            if ((level + 1) % 5 === 0) {  // Increase difficulty after every 10 levels
                setDifficulty(difficultyLevels[Math.min(difficultyLevels.indexOf(difficulty) + 1, difficultyLevels.length - 1)]);
            }
        }
    }, [highScore, level, difficulty, difficultyLevels]);

    useEffect(() => {
        generateRandomKeys(true);
    }, [generateRandomKeys]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (timeUp || gameOver) return;

            const key = event.key.toUpperCase();
            if (key === activeKeys[currentPosition]) {
                setSequence((prevSequence) => {
                    const newSequence = [...prevSequence];
                    newSequence[currentPosition] = true;
                    return newSequence;
                });
            
                setCurrentPosition((prevPosition) => prevPosition + 1);
            
                if (currentPosition + 1 === activeKeys.length) {
                    generateRandomKeys();
                }
            } else {
                setGameOver(true);
                setPlayErrorSound(true);
                showModal();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [activeKeys, currentPosition, timeUp, gameOver, generateRandomKeys]);

    useEffect(() => {
        const errorAudio = new Audio(errorSound);

        if (playErrorSound) {
            errorAudio.play(); 
            setPlayErrorSound(false);
        }
    }, [playErrorSound]);

    return (
        <main id={style.container}>
            <div className={style.game}>
                <div className={style.containerRaio}>
                    <img className={style.imgRaio} src="imgs/raio1.png" alt="raio" />
                    <img className={style.imgCoroa} src="imgs/coroa.png" alt="coroa" />
                    <img className={style.imgRaio} src="imgs/raio2.png" alt="raio" />
                </div>
                <p className={style.gameName}>Mini-Game</p>
                <p className={style.gameTag}>Pressione as teclas corretamente</p>
                <div className={style.caixaGameHighScore}>
                    <p className={style.Score1} >{level}</p>
                    <p className={style.Score2} >{difficulty}</p>
                    <p className={style.gameHighScore}> {highScore}</p>
                </div>
                <div className={style.mecanicaGame}>
                    <div className={style.teclas}>
                        {activeKeys.map((key, index) => (
                            <div
                                key={index}
                                className={`${style.abc} ${style[key.toLowerCase()]} ${sequence[index] ? style.active : ""}`}
                            >
                                {key}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={style.containerLoading}>
                    <div className={style.inLoading}>
                        <div className={style.loading} style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
 
                <Modal show={show} handleClose={hideModal} title={"Você perdeu!"}>
                    <div> 
                        <div className={style.scoreGame}>
                            <p>Nível: {level}</p>
                            <p>Pontos: {points}</p>
                            <p>High Score: {highScore}</p>
                        </div>
                        <div className={style.buttonModal}>
                            <Link to={"/"}>
                                <button title="Retornar ao menu inicial" onClick={hideModal}>Sair</button>
                            </Link>
                            <button title="Retornar ao nivel [ 1 ]" onClick={restartGame}>Reiniciar</button>
                            <button title="Será consumido 50 pontos ao continuar" onClick={continueGame}>
                                Continuar
                            </button> 
                        </div>
                        <div className={style.errorMessage}>
                            {errorMessage && <p>{errorMessage}</p>}
                        </div>
                    </div>
                </Modal>
            </div>
        </main>
    );
}
