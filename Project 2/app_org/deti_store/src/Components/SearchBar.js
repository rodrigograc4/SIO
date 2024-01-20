import React, { useState } from 'react';
//import { useLocation } from 'react-router-dom';
import '../Css/SearchBar.css';
import DOMPurify from 'dompurify';



const SearchBar = ({ onSearch, onCategoryChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All'); // Define selectedCategory state
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100);

    const handleSearch = async () => {


        if (minPrice > maxPrice) {
            alert('Minimum price cannot be greater than maximum price');
            return;
        }
        try {

          let apiUrl = `http://localhost:5000/api/produtos/search?query=${searchQuery}`;  

          // Check if the selected category is not "All"
          if (selectedCategory !== "All") {
              apiUrl += `&category=${selectedCategory}`;
          }

          apiUrl += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
  
          const response = await fetch(apiUrl);
          
          if (response.ok) {
            const data = await response.json();
            //console.log("Data received in SearchBar:", data); // Log received data
            onSearch(data);
          } else {
            console.error('Failed to fetch search results');
          }
        } catch (error) {
            console.error('Error searching products:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };



    return (
        <div className="search-bar">
            <div className="search-bar-content">
            <input
                type="text"
                placeholder="Search products..."
                value={DOMPurify.sanitize(searchQuery)} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                onKeyPress={handleKeyPress}>
            </input>
                <select defaultValue={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="All">All Categories</option>
                    <option value="Chapeu">Cap</option>
                    <option value="Hoodie">Hoodie</option>
                    <option value="T-Shirt">T-Shirt</option>
                    <option value="Cachecol">Scarf</option>
                </select>
            </div>
            <div className="price-slider">
                <label>Price Range:</label>
                <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={minPrice}
                onChange={(e) => setMinPrice(parseInt(e.target.value))}
                />
                <span>${minPrice}</span>
                <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                />
                <span>${maxPrice}</span>
            </div>
            <button className="search-btn" onClick={handleSearch}>Search</button>

        </div>
    );
};

export default SearchBar;