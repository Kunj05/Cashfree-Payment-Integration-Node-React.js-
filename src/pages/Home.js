import React from "react";
import ItemCard from "../components/ItemCard";

const items = [
  { id: 1, name: "Item 1", price: "$10" },
  { id: 2, name: "Item 2", price: "$20" },
  { id: 3, name: "Item 3", price: "$30" },
];

function Home() {
  return (
    <div>
      <h1>Welcome to Our Shop!</h1>
      <div className="item-list">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Home;
