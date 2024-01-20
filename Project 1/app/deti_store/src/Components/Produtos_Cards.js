import React, { useEffect, useState } from "react";
import '../Css/Produtos_Cards.css';
import { useAuth } from '../Context/AuthContext';
import { Link } from 'react-router-dom';

const Produtos_Cards = ({ item }) => {
    //console.log("Data in Produtos_Cards:", item);

    const [isOutOfStock, setIsOutOfStock] = useState(item.Nstock === 0);
    const [isEditing, setIsEditing] = useState(false);
    const [editedItem, setEditedItem] = useState({ ...item });
    const { userInfo,isLoggedIn } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false); //new
    //console.log("User info:", editedItem);

    const foto_url = `http://localhost:5000/public/Images/${editedItem.foto_url}`;
    //console.log("Foto url:", foto_url);

    useEffect(() => {
        // Watch for changes to the 'item' prop and update 'editedItem' when it changes
        setEditedItem({ ...item });
    }, [item]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        const precoValue = parseFloat(editedItem.preco);
        const Nstock = parseInt(editedItem.Nstock, 10);


    

        const precoFormatted = precoValue.toFixed(2);
    
        try {
            const updatedItemData = {
                id: item.id,
                ...editedItem,
                preco: precoFormatted,
                Nstock:Nstock, // Use o valor formatado
            };
    
            const response = await fetch('http://localhost:5000/api/updateitems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItemData), // Envie o objeto atualizado
            });
    
            if (response.ok) {
                const updatedItem = await response.json();
                console.log(updatedItem);
                setIsEditing(false);
                window.location.reload();
            } else {
                console.error('Error updating item:', response);
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDeleteClick = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/deleteitem/${item.id}`, {
            method: 'DELETE',
          });
      
          if (response.status === 200) {
            console.log('Item deleted successfully');
            window.location.reload();
          } else {
            console.error('Failed to delete the item');
            // Handle errors or show an error message to the user.
          }
        } catch (error) {
          console.error('Error deleting the item:', error);
          // Handle network or server errors here.
        }
      };
    
    
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedItem((prevItem) => ({
            ...prevItem,
            [name]: value,
        }));
    };

    

    
    const handleFavoriteClick = async () => {
        

      if (!isLoggedIn) {
          alert('Please log in to add items to favorites');
          return;
      }

      const userId = userInfo.id /* Get the userId value from wherever it's stored */;
      const productId = item.id;

      if (isFavorite) {
        try {
          const response = await fetch('http://localhost:5000/api/favorites/remove', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, productId }), // Include the userId in the request body
          });
    
          if (response.status === 200) {
            console.log('Item removed from favorites successfully');
            setIsFavorite(false);
          } else {
            console.error('Failed to remove the item from favorites');
          }
        } catch (error) {
          console.error('Error removing item from favorites:', error);
        }
      } else {
        try {
          const response = await fetch('http://localhost:5000/api/favorites/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, productId }), // Include the userId in the request body
          });
    
          if (response.status === 200) {
            console.log('Item added to favorites successfully');
            setIsFavorite(true);
          } else {
            console.error('Failed to add the item to favorites');
          }
        } catch (error) {
          console.error('Error adding item to favorites:', error);
        }
      }
    };


    const handleCartClick = async () => {
      try {
        console.log("Product_id:", item.id);
        const quantity = 1;

        // Add the item to cart
        const response = await fetch('http://localhost:5000/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userInfo.id, Product: item, quantity: quantity }),
        });

        //console.log("Olha a resposta: ",response);

        if (response.status === 200) {
          console.log('Item added to cart successfully');
          window.location.reload();
        } else if (response.status === 400) {
          console.error('Invalid quantity. The item was not added to the cart.');
        } else {
          console.error('Failed to add the item to cart');
        }
      } catch (error) {
        console.error('Error adding item to cart:', error);
        // Handle network or server errors here.
      }

    };
      
      


    return (
        <div className={`product-card ${isOutOfStock ? "out-of-stock" : ""}`}>
            {isOutOfStock && !isEditing && <div className="overlay">Out of Stock</div>}
            {isLoggedIn ? (
                 (
                    <div className="edit-overlay">
            {isEditing ? (
                <div className="link-cards-edit">
                <a onClick={handleSaveClick}>Save</a>
                <a onClick={handleDeleteClick}>Delete</a>
                </div>
            ) : (
                <a onClick={handleEditClick}>Edit this item</a>
            )}
        </div>

                )
                ) : null}

            <div className="badge">Hot</div>
            <div className="product-tumb">
                    <img src={foto_url} alt="" />
            </div>
            <div className="product-details">
                <span className="product-catagory">
                    {isEditing ? (
                        <input
                            type="text"
                            name="tipo"
                            value={editedItem.tipo}
                            onChange={handleInputChange}
                        />
                    ) : (
                        editedItem.tipo
                    )}
                </span>
                <h4>
                    {isEditing ? (
                        <input
                            type="text"
                            name="nome"
                            value={editedItem.nome}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <Link  to={`/detailproduct/${editedItem.id}`}>
                            {editedItem.nome}
                        </Link>
                    )}
                </h4>
                <p>
                    {isEditing ? (
                        <input
                            type="text"
                            name="descricao"
                            value={editedItem.descricao}
                            onChange={handleInputChange}
                        />
                    ) : (
                        editedItem.descricao
                    )}
                </p>
                <p>
                    Tamanho:{" "}
                    {isEditing ? (
                        <input
                            type="text"
                            name="tamanho"
                            value={editedItem.tamanho}
                            onChange={handleInputChange}
                        />
                    ) : (
                        editedItem.tamanho
                    )}
                </p>
                <div className="product-bottom-details">
                    <div className="product-price">
                        <small>96.00€</small>
                        {isEditing ? (
                           <div className="row">
                            <p>Preco:</p>
                            <input
                                type="text"
                                name="preco"
                                value={editedItem.preco}
                                onChange={handleInputChange}
                            />
                             <p>Stock:</p>
                            <input
                                type="text"
                                name="Nstock"
                                value={editedItem.Nstock}
                                onChange={handleInputChange}
                            />
                            </div>
                        ) : (
                            editedItem.preco
                        )}
                        €
                    </div>
                    <div className="product-links">
                    <a
                        className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                        onClick={handleFavoriteClick}
                    >
                        {isFavorite ? <i className="fas fa-heart" /> : <i className="far fa-heart" />}
                    </a>
                        <a className="cartIcon" onClick={handleCartClick} role="button" tabIndex="0">
                            <i className="fa fa-shopping-cart"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Produtos_Cards;
