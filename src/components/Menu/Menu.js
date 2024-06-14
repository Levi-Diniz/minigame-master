import React, { useState, useEffect } from 'react';
import styles from './menu.module.css';
import { Link } from 'react-router-dom';
import Modal from '../Modal/Modal';

const jogosData = [
    { id: 1, route: '/teclas', src: 'imgs/Mini_Game.png', alt: 'minigame 1' },
    { id: 2, route: '/', src: 'imgs/beta.jpeg', alt: 'minigame 2' },
];

export default function Menu() {
    const defaultImagePerfil = 'imgs/User.png';
    const [imagePerfil, setImagePerfil] = useState(defaultImagePerfil);
    const [name, setName] = useState('Seu Nome');
    const [points, setPoints] = useState(0); // Estado para os pontos
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [newName, setNewName] = useState('');
    const [newImagePerfil, setNewImagePerfil] = useState('');
    const [bestLevel, setBestLevel] = useState(0); // Estado para o melhor nível conquistado

    useEffect(() => {
        // Carrega os pontos do local storage quando o componente é montado
        const savedPoints = localStorage.getItem('points');
        if (savedPoints) {
            setPoints(parseInt(savedPoints, 10));
        }

        // Carrega o nome do local storage quando o componente é montado
        const savedName = localStorage.getItem('name');
        if (savedName) {
            setName(savedName);
        }

        // Carrega a imagem do local storage quando o componente é montado
        const savedImage = localStorage.getItem('imagePerfil');
        if (savedImage) {
            setImagePerfil(savedImage);
        }

        // Carrega o high score (melhor nível) do local storage quando o componente é montado
        const savedHighScore = localStorage.getItem('highScore');
        if (savedHighScore) {
            setBestLevel(parseInt(savedHighScore, 10));
        }
    }, []);

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleImageChange = (e) => {
        setNewImagePerfil(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newName.trim() !== '') {
            setName(newName);
            localStorage.setItem('name', newName);
            setNewName('');
            setShowEdit(false);
        }
        if (newImagePerfil.trim() !== '') {
            setImagePerfil(newImagePerfil);
            localStorage.setItem('imagePerfil', newImagePerfil);
            setNewImagePerfil('');
        }
    };

    const togleShowModalEdit = () => {
        setShowEdit(!showEdit);
    };

    const showModal = () => {
        setShow(true);
    };

    const hideModal = () => {
        setShow(false);
    };

    return (
        <main>
            <div className={styles.teste}>
                <div className={styles.container}>
                    <div className={styles.player}>
                        <div className={styles.caixaEdit}>
                            <h className={styles.edit} onClick={togleShowModalEdit}>
                                Editar
                            </h>
                        </div>
                        <img src={imagePerfil} alt='perfil' />
                        <p className={styles.nameGame}>{name}</p>
                        <div className={styles.PontosPlayer}>
                            <p className={styles.PontosPlayer1}>PONTOS:</p>
                            <p className={styles.PontosPlayer2}>{points}</p>
                        </div>
                    </div>
                    <div className={styles.infoplayer}>
                        <div className={styles.caixaInfoplayer}>
                            <h>Melhor nível conquistado</h>
                            <p>Desafio das teclas: {bestLevel}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.container2}>
                    <div className={styles.jogos}>
                        {jogosData.map((jogo) =>
                            jogo.route === '/' ? (
                                <img onClick={showModal} key={jogo.id} src={jogo.src} alt={jogo.alt} />
                            ) : (
                                <Link key={jogo.id} to={jogo.route}>
                                    <img key={jogo.id} src={jogo.src} alt={jogo.alt} />
                                </Link>
                            )
                        )}
                    </div>
                    <Modal show={show} handleClose={hideModal} title={'Volte mais tarde..'} button={'on'}>
                        <div>
                            <div className={styles.scoreGame}>
                                <p>Mini game em desenvolvimento.</p>
                            </div>
                        </div>
                    </Modal>
                    <Modal show={showEdit} handleClose={togleShowModalEdit} title={'Edit suas informações'} button={'on'}>
                        <div>
                            <div className={styles.scoreGame}>
                                <form className={styles.editInfo} onSubmit={handleSubmit}>
                                    <label htmlFor='newName'></label>
                                    <input
                                        id='newName'
                                        type='text'
                                        value={newName}
                                        onChange={handleNameChange}
                                        placeholder='name..'
                                        required
                                    />
                                    <label htmlFor='newImagePerfil'></label>
                                    <input
                                        id='newImagePerfil'
                                        type='text'
                                        value={newImagePerfil}
                                        onChange={handleImageChange}
                                        placeholder='image url..'
                                        required
                                    />
                                    {/* <div> */}
                                        <button type='submit'>Salvar</button>
                                    {/* </div> */}
                                </form>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </main>
    );
}
