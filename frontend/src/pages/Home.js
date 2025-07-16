import { useState, useEffect } from 'react';
import axios from 'axios'
import './Home.css';
import React from 'react';
import MenuBar from '../components/MenuBar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import Card from "../components/DigimonCard";

function Home() {
    const [cards, setCards] = useState([]);

    useEffect(() => {

        axios.get('http://localhost:3001/api/threeLikedCards')
            .then(function (response) {
                const data = response.data.topCards
                console.log("DARA IAS: ", data)
                setCards(data)
            })
            .catch(function (error) {
                console.log(error);
            })

    }, []);


    return (
        <>
            <MenuBar />
            <div className="background-home">
                <div className="home-content">
                    <h1>Welcome to the Digimon Card Shop!</h1>
                    <p>Explore a vast collection of Digimon cards and build your ultimate deck.</p>
                    <Link to="/pages" className="home-button">Browse Cards</Link>
                </div>
            </div>
            <div className="grid-parent-home">
                <div className="grid-child-home-1"></div>
                <div className="grid-child-home-2"> <p>Unleash the Power of Digivolution! 🏆🔥</p> <p>Collect Your Favorite Digimon Cards Today!</p>  </div>
                <div className="grid-child-home-3"><p>Choose Your Champion, Build Your Team! 🌟</p> <p>Get Your Favorite Digimon Cards Now!</p> </div>
                <div className="grid-child-home-4"></div>
            </div>
            <h1 className='title-top-cards'>Top 3 favorite cards: </h1>
            <div className="digimon-list-home">
                {cards.length == 0 ? <p>EMPTY TOP CARDS</p> : cards.map(card =>
                    (<Card key={card._id} card={card} />))}
            </div>
            <Footer />
        </>
    );
}

export default Home;
