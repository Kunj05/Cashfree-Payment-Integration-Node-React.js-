import React from "react";
import { Link } from "react-router-dom";

function ItemCard({ item }) {
  return (
    <div className="item-card">
      <h2>{item.name}</h2>
      <p>{item.price}</p>
      <Link to={`/product/${item.id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
}

export default ItemCard;
