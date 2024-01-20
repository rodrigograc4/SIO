import React, { useState, useEffect } from "react";
import "../Css/MyOrders.css";
import { useAuth } from "../Context/AuthContext";
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const { userInfo, isLoggedIn, user_id} = useAuth();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]); 
  const [orderDetails, setOrderDetails] = useState([]);
  const processedOrderIds = {};

  useEffect(() => {
    setLoading(true);


    // Depuração: verifique os valores de user_id e userInfo
    console.log("user_id:", user_id);
    console.log("userInfo:", userInfo);


    fetch("http://localhost:5000/api/myorders", {
      headers: {
        userId: user_id || 0, // Pass the user_id in the request header
      },
    })
      .then((response) => response.json())
      .then((data) => {

        // Depuração: verifique os dados recebidos da API
        console.log("API data:", data);

        setOrders(data);
        setOrderDetails(data);

        setLoading(false);
      })
      .catch((error) => { 
        console.error("Error fetching data from the API:", error);
        setLoading(false);
      });
  }, [userInfo, user_id]);

  useEffect(() => {
    console.log("Orders:", orders);
    console.log("Order details:", orderDetails);
  }, [orders]);

  if (!isLoggedIn) {
    return <div>Please log in to view your orders.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="MyOrdersPage">
      <div className='center-orders'>
        <h2 className='orders-title'>All My Orders</h2>
        <div>
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order) => {
              if (!processedOrderIds[order.order_id]) {
                processedOrderIds[order.order_id] = true; // Marque o ID do pedido como processado
                const orderDetails = orders.filter((o) => o.order_id === order.order_id);
                return (
                  <div key={order.order_id} className="orders-container">
                    <h3>Order ID: {order.order_id}</h3>
                    <p>Total: ${order.total}</p>
                    <p style={{ marginBottom: '3rem' }}>Status: {order.status === 1 ? "Processing" : order.status === 2 ? "Shipped" : "Delivered"}</p>
                    <div className="order-detail-container">
                      {Array.isArray(orderDetails) && orderDetails.length > 0 ? (
                        orderDetails.map((detail) => (
                          <div key={detail.detail_id} className="details-container">
                            <Link to={`/detailproduct/${detail.Product_id}`}>
                              <h2>Produto: {detail.Product_name}</h2>
                              <p>Tamanho: {detail.Product_size || 'N/A'}</p>
                              <p>Preço: {detail.Product_price}€</p>
                            </Link>
                          </div>
                        ))
                      ) : (
                        <p>No details available for this order.</p>
                      )}
                    </div>
                  </div>
                );
              } else {
                return null; // Não renderizar contêineres duplicados
              }
            })
          ) : (
            <div>No orders available.</div>
          )}
        </div>
      </div>
    </div>
  );  
};

export default MyOrders;
