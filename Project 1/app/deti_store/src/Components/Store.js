import React, { useEffect, useState } from 'react';
import Produtos_Cards from './Produtos_Cards';
import CartItems from './CartItems';
import '../Css/CartItems.css';
import '../Css/Store.css';
import { useAuth } from '../Context/AuthContext';
import SearchBar from './SearchBar';



const Store = () => {
  const [data, setData] = useState([]);
  const { userInfo, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [total, setTotal] = useState(0);

  

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/produtos')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setData(data); 
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar dados da API:', error);
        setLoading(false);
      });
  }, [selectedCategory]);

  const fetchCartTotal = () => {
    if (userInfo) {
      fetch(`http://localhost:5000/api/cart/total/${userInfo.id}`)
        .then((response) => response.json())
        .then((data) => {
          setTotal(data.total);
        })
        .catch((error) => {
          console.error('Error fetching cart total:', error);
        });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartTotal();
    }
  }, [isLoggedIn, userInfo]);

  if (isLoggedIn){
    if (userInfo === null) {
      return <div>Loading...</div>;
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSearchData = (searchData) => {
    //console.log("Data received in Store:", searchData); // Log received data
    setData(searchData);
  };

  const clearCart = () => {
    if (userInfo) {
      fetch(`http://localhost:5000/api/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userInfo.id }),
      })
        .then((response) => response.json())
        .then(() => {
          // Cart cleared successfully, you can update the UI if needed
          console.log('Carrinho esvaziado com sucesso');
          setTotal(0); // Reset the cart total
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error clearing cart:', error);
        });
    }
    
  };




  

  


  return (
    <div className="Store">
      <div className="left-store">
        <SearchBar onSearch={handleSearchData} onCategoryChange={setSelectedCategory} />
        <section id="cart" className="section-p1">
          <table>
            <thead id="thead1">
              <tr>
                <td id="rem">Remover</td>
                <td id="im">Imagem</td>
                <td id="prod">Produto</td>
                <td id="prec">Preço</td>
                <td id="quan">Quantidade</td>
                <td id="sub">SubTotal</td>
              </tr>
            </thead>
            
            {isLoggedIn && userInfo && data.length > 0 && (
              <CartItems userInfo={userInfo} item={data[0]} />
            )}
            
          </table>
          <div style={{ marginTop: "40px" }}>
            <button className="normal" id="delCart" onClick={clearCart}>
              Esvaziar Carrinho
            </button>
          </div>
        </section>
        <section id="cart-add" className="section-p1">
          <div id="subtotal">
            <h3>Total do Carrinho</h3>
            <table id="table">
              <tbody>
                <tr>
                  <td>Total:</td>
                  <td>{total}€</td>
                </tr>
              </tbody>
            </table>
            <button className="normal" id="gotocheckout" onClick={() => (window.location.href = "/checkout")}>Avançar para Pagamento</button>
          </div>
        </section>
      </div>
      <div className='right-store'>
        <h2 className='store-title'>All products</h2>
        <div className="product-cards-container">
          {Array.isArray(data) ? (
            data.map((item, index) => (
                <Produtos_Cards key={index} item={item} />
            ))
          ) : (
            <div>No products available.</div>
          )}
          {isLoggedIn ? (
            userInfo.isAdmin === true && (
              <button className="btn edit-button add-product" onClick={() => (window.location.href = "/addproduct")}>
                <i className="animation"></i>Add product +<i className="animation"></i>
              </button>
            )
          ) : null}
        </div>
      </div>
    </div>
  );  
};

export default Store;


