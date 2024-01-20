import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Store from './Components/Store';
import Login from './Components/Login';
import Register from './Components/Register';
import Profile from './Components/Profile';
import EditProfile from './Components/EditProfile';
import AddProduct from './Components/AddProduct';
import ChangePassword from './Components/ChangePassword';
import MyOrders from './Components/MyOrders';
import DetailProduct from './Components/DetailProduct';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Checkout from './Components/Checkout';
import Layout from './Context/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Layout/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/editprofile" element={<EditProfile/>}/>
          <Route path="/addproduct" element={<AddProduct/>}/>
          <Route path='/changepassword' element={<ChangePassword/>}/>
          <Route path='/myorders' element={<MyOrders/>}/>
          <Route path="/detailproduct/:id" element={<DetailProduct/>} />
          <Route path='/checkout' element={<Checkout/>}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
