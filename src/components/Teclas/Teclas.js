import React, { useState, useEffect, useCallback } from "react";
import style from "./teclas.module.css";
import Modal from "../Modal/Modal";
import { Link } from "react-router-dom";
import errorSound from "./1.mp3"; // Importe o arquivo de áudio de erro

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
    const [playErrorSound, setPlayErrorSound] = useState(false); // Estado para controlar a reprodução do som de erro

    const showModal = () => {
        setShow(true);
    };

    const hideModal = () => {
        setShow(false);
        setErrorMessage(""); // Resetar a mensagem de erro ao fechar o modal
    };

    const restartGame = () => {
        setErrorMessage("");
        setShow(false);
        setGameOver(false);
        setLevel(1);
        generateRandomKeys(true); // Passa true para não incrementar o nível
    };

    const continueGame = () => {
        if (points >= 20) {
            setLevel((prevLevel) => prevLevel - 1);
            setShow(false);
            setGameOver(false);
            setPoints((prevPoints) => {
                const newPoints = prevPoints - 20;
                localStorage.setItem("points", newPoints); // Salva os pontos atualizados
                return newPoints;
            });
            generateRandomKeys(false); // Continua o jogo do mesmo nível
        } else {
            setErrorMessage("Você não tem pontos suficientes para continuar.");
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (progress < 100 && !gameOver) {
                setProgress(progress + 1);
            } else {
                setTimeUp(true);
                setGameOver(true);
                clearTimeout(timer);
                showModal();
            }
        }, 50);

        return () => clearTimeout(timer);
    }, [progress, gameOver]);

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
            // Atualiza o nível e os pontos
            setLevel((prevLevel) => prevLevel + 1);
            setPoints((prevPoints) => {
                const newPoints = prevPoints + 10;
                localStorage.setItem("points", newPoints); // Salva os pontos atualizados
                return newPoints;
            });

            // Atualiza o high score apenas se o nível atual for maior que o high score atual
            if (level > highScore) {
                setHighScore(level);
                localStorage.setItem("highScore", level); // Salva o high score atualizado
            }
        }
    }, [highScore, level]);

    useEffect(() => {
        generateRandomKeys(true); // Inicializa sem incrementar o nível
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
                    generateRandomKeys(); // Gera novas teclas
                }
            } else {
                setGameOver(true);
                setPlayErrorSound(true); // Ativa o estado para reproduzir o som de erro
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
            errorAudio.play(); // Reproduz o som de erro
            setPlayErrorSound(false); // Reseta o estado após a reprodução do som
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
                    <p className={style.gameHighScore}>{highScore}</p>
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
                                <button onClick={hideModal}>Sair</button>
                            </Link>
                            <button onClick={restartGame}>Reiniciar</button>
                            <button onClick={continueGame}>Continuar</button> 
                        </div>
                        <div className={style.errorMessage}>
                            {errorMessage && <p>{errorMessage}</p>} {/* Exibe a mensagem de erro se houver */}
                        </div>
                    </div>
                </Modal>

            </div>
        </main>
    );
}
