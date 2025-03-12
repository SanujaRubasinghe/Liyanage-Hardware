import React from "react";
import "./SubCategoryTable.css";

const SubCategoryTable = () => {
  const subCategories = [
    { id: 1, category: "Women", subCategory: "Jewellery", description: "Women prefer jewellery more than other items", image: "https://via.placeholder.com/50" },
    { id: 2, category: "Men", subCategory: "Sports", description: "Give men anything he will wear", image: "https://via.placeholder.com/50" },
    { id: 3, category: "Kids", subCategory: "Shirts", description: "Everything suits on kids", image: "https://via.placeholder.com/50" },
    { id: 4, category: "Cosmetics", subCategory: "Face Wash", description: "This Facewash Shines your face", image: "https://via.placeholder.com/50" },
    { id: 5, category: "Cosmetics", subCategory: "Hair Care", description: "Care your hair timely otherwise they will damage", image: "https://via.placeholder.com/50" },
    { id: 6, category: "Kids", subCategory: "Trackpant", description: "Check your size of your trackpant", image: "https://via.placeholder.com/50" },
    { id: 7, category: "Kids", subCategory: "Jackets", description: "Jacket keeps your body warm", image: "https://via.placeholder.com/50" },
    { id: 8, category: "Women", subCategory: "Jewellery", description: "Jewellery is best", image: "https://via.placeholder.com/50" },
  ];

  return (
    <div className="subcategory-table-container">
      <h2>Product Details</h2>
      <table className="subcategory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cat Title</th>
            <th>SubCat Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subCategories.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.category}</td>
              <td>{item.subCategory}</td>
              <td>{item.description}</td>
              <td><img src={item.image} alt="subcategory" /></td>
              <td>
                <button className="subcategory-delete-btn">Delete</button>
                <button className="subcategory-edit-btn">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubCategoryTable;
