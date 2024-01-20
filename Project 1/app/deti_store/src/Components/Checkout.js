import React, { useEffect, useState } from 'react';
import '../Css/Checkout.css'
import { useAuth } from '../Context/AuthContext';
import CartItems from './CartItems';


function Checkout() {
        const { userInfo, isLoggedIn } = useAuth();
        const [total, setTotal] = useState(0);
        const [data, setData] = useState([]);
    
      
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
                  console.log('Carrinho esvaziado com sucesso');
                  setTotal(0); 
                  setTimeout(() => {
                    console.log("@")
                    window.location.href("/");
                  }, 2000);
                  
                })
                .catch((error) => {
                  console.error('Error clearing cart:', error);
                });
            }
            
          };


    return (
       <div className='checkout-page'>
            <div className='checkout-page-left'>
                <h2>Products list:</h2>
                <div className='checkout-cart'>
                {isLoggedIn && userInfo && data.length > 0 && (
                    <CartItems userInfo={userInfo} item={data[0]} />
                )}
                 <section id="cart-add" className="section-p1">
                    <div id="subtotal">
                        <h3>Total:</h3>
                        <table id="table">
                        <tbody>
                            <tr>
                            <td>Total:</td>
                            <td>{total}€</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    </section>
                </div>
            </div>
            <div className='checkout-page-right'>
                <h1>Checkout</h1>
                <div class="wrapper">
    <div class="container">
        <form action="">
            <h1>
                <i class="fas fa-shipping-fast"></i>
                Shipping Details
            </h1>
            <div class="name">
                <div>
                    <label for="f-name">First</label>
                    <input type="text" name="f-name"/>
                </div>
                <div>
                    <label for="l-name">Last</label>
                    <input type="text" name="l-name"/>
                </div>
            </div>
            <div class="street">
                <label for="name">Street</label>
                <input type="text" name="address"/>
            </div>
            <div class="address-info">
                <div>
                    <label for="city">City</label>
                    <input type="text" name="city"/>
                </div>
                <div>
                    <label for="state">State</label>
                    <input type="text" name="state"/>
                </div>
                <div>
                    <label for="zip">Zip</label>
                    <input type="text" name="zip"/>
                </div>
            </div>
            <h1>
                <i class="far fa-credit-card"></i> Payment Information
            </h1>
            <div class="cc-num">
                <label for="card-num">Credit Card No.</label>
                <input type="text" name="card-num"/>
            </div>
            <div class="cc-info">
                <div>
                    <label for="card-num">Exp</label>
                    <input type="text" name="expire"/>
                </div>
                <div>
                    <label for="card-num">CCV</label>
                    <input type="text" name="security"/>
                </div>
            </div>
            <div class="btns">
                <button className="btn edit-button" onClick={clearCart}>
                <i className="animation"></i>Purchase<i className="animation"></i>
                </button>
                <button className="btn edit-button" onClick={() => (window.location.href = "/store")}>
                <i className="animation"></i>Back to store<i className="animation"></i>
              </button>
            </div>
        </form>
    </div>
</div>
            </div>
       </div>
    );
}

export default Checkout;
