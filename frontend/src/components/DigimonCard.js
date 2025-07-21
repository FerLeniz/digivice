import React from "react";
import { Heart, SquarePlus } from "lucide-react";
import "./DigimonCard.css";

const DigimonCard = ({ card, isLiked, onLike, showPriceSection = false }) => {
  return (
    <>
      <div className="digimon-card">
        <div className="card">
          <div className="card-header">{card.name}</div>
          <div className="card-image">
            <img
              src={card.image}
              alt={card.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="card-stats">
            <div>Level: {card.level ? card.level : "Unknown"}</div>
            <div>Attribute: {card.attribute ? card.attribute : "Unknown"}</div>
          </div>
          <div className="card-footer">Type: {card.type ? card.type : "Unknown"}</div>
          {showPriceSection && (
            <div className="price-section">
              <Heart
                className="price-section-icon"
                fill={isLiked ? "white" : "none"}
                stroke="white"
                size={25}
                onClick={() => onLike(card._id)}
              />
              <p>${card.price}</p>
              <SquarePlus className="price-section-icon" size={25} />
            </div>)}
        </div>
      </div>
    </>
  );
};

export default DigimonCard;