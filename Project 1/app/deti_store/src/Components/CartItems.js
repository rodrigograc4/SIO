import React, { useEffect, useState } from 'react';
import '../Css/CartItems.css';

const CartItems = ({ userInfo, item }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const foto_url = `http://localhost:5000/public/Images/${item.foto_url}`;

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/cart/items/${userInfo.id}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setCartItems(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar itens do carrinho:', error);
        setLoading(false);
      });
  }, [userInfo]);



  



  const handleQuantityProdChange = async (event, item, quantity) => {
    
    //console.log("Product_id:", item.id);
    //console.log("Quantity:", quantity);
    try {
      // Update the item's quantity in the cart
      const response = await fetch('http://localhost:5000/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userInfo.id, product: item, quantity: quantity }),
      });

      if (response.status === 200) {
        console.log('Item quantity updated successfully');
      
      } else if (response.status === 404) {
        
        console.error('Item not found in the cart');
      } else {
        
        console.error('Failed to update item quantity in the cart');
      }
    } catch (error) {
      console.error('Error updating item quantity in the cart:', error);
      
    }

    window.location.reload();

    
  };

  const handleDelProdClick = async (product) => {

    
    try {
      const response = await fetch('http://localhost:5000/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userInfo.id, productId: product.id }),
      });

      if (response.status === 200) {
        
        const updatedCartItems = cartItems.filter((item) => item.id !== product.id);
        setCartItems(updatedCartItems);
        console.log('Item removido com sucesso do carrinho');
      } else if (response.status === 404) {
        console.error('Item not found in the cart');
      } else {
        console.error('Failed to remove the item from the cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  if (loading) {
    return <div>Loading cart items...</div>;
  }

  return (
    <tbody id="thead2">
      {cartItems.map((item, index) => (
        <tr key={index}>
          <td id="deleteProd">
            <a id="btnrem" onClick={() => handleDelProdClick(item)}>
              <i className="fas fa-times-circle"></i>
            </a>
          </td>
          <td id="imP"><img src={`http://localhost:5000/public/Images/${item.foto_url}`} alt="" id="imPP"/></td>
          <td id="nomeP">{item.nome}</td>
          <td id="precoP">{(item.preco).toFixed(2)}€</td>
          <td id="quantP">
            <input
              type="number"
              id="quant"
              onChange={(event) => handleQuantityProdChange(event, item, event.target.value)}
              value={item.quantity}
            />
          </td>
          <td id="precT">{(item.preco * item.quantity).toFixed(2)}€</td>
        </tr>
      ))}
    </tbody>
  );
};

export default CartItems;
