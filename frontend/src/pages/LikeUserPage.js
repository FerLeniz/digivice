import React, { useState, useEffect } from "react";
import "./LikeUserPage.css";
import MenuBar from "../components/MenuBar";
import Card from "../components/DigimonCard";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { toggleLike } from '../redux/authSlice';

function LikeUserPage() {
  const [cards, setCards] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const likedCards = new Set(user?.likedCards || []);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLikedCards = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/auth/likedCards", {
          withCredentials: true,
        });
        if (response.data.likedCards.length > 0) setCards(response.data.likedCards);
      } catch (error) {
        console.error("Error fetching liked cards", error);
      }
    };

    fetchLikedCards();
  }, []);

  const handleLike = async (cardId) => {
    try {
      await axios.post(`http://localhost:3001/api/auth/like/${cardId}`, {}, { withCredentials: true });

      dispatch(toggleLike(cardId));

      toast.success(likedCards.has(cardId) ? "Card unliked successfully!" : "Card liked successfully!");

      setCards((prevCards) => prevCards.filter(card => user?.likedCards.includes(card._id)));
    } catch (error) {
      console.error("Error liking card:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <MenuBar />
      <ToastContainer />
      <div className="like-container">
        {cards.length > 0 ? <h1>YOUR FAVORITE CARDS:</h1> : <h1 className="no-items-message">Items not added yet!</h1>}
        {cards.length > 0 && (
          <div className="cards-grid">
            {cards.map((card) => (
              <Card key={card._id} card={card} isLiked={likedCards.has(card._id)} onLike={handleLike} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default LikeUserPage;