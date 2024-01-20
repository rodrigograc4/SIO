import React, {useState, useEffect} from 'react';
import '../Css/AddProduct.css';

function AddProduct() {

    const [productData, setProductData] = useState({
        foto_url: null,
        tipo: '',
        nome: '',
        descricao: '',
        tamanho: '',
        preco: '',
        Nstock: 0, // Você pode definir um valor inicial para Nstock
      });

      useEffect(() => {
        console.log(productData); // Isso irá mostrar o valor atualizado de foto_url
      }, [productData]);
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
      };

      const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProductData({ ...productData, foto_url: file });

      };
    
      const handleAddItem = async (e) => {
        e.preventDefault();
      
        const formData = new FormData();
        formData.append('tipo', productData.tipo);
        formData.append('nome', productData.nome);
        formData.append('foto_url', productData.foto_url);
        formData.append('descricao', productData.descricao);
        formData.append('tamanho', productData.tamanho);
        formData.append('preco', productData.preco);
        formData.append('Nstock', productData.Nstock);
      
        try {
          const response = await fetch('http://localhost:5000/api/insertitems', {
            method: 'POST',
            body: formData,
          });
      
          if (response.status === 200) {
            console.log('Item adicionado com sucesso');
            document.body.classList.add('modal-open');
            const successModal = document.getElementById("success-modal");
            successModal.style.display = "block";
  
            
            setTimeout(() => {
                
                document.body.classList.remove('modal-open');
                window.location.href = '/store';
            }, 3000);
          } else {
            console.error('Erro ao adicionar o item');
          }
        } catch (error) {
          console.error('Erro ao adicionar o item:', error);
        }
      };


    return (
        <div className='additem-page'>
        <div className='additem-modal'>
          <h3>Add an item</h3>
          <form onSubmit={handleAddItem} encType="multipart/form-data">
            <div className='form-group-item'>
              <label htmlFor='foto_url'>Foto URL:</label>
              <input
                type='file'
                name='foto_url'
                onChange={handleFileChange}
                required 
                />
            </div>
            <div className='form-group-item'>
              <label htmlFor='tipo'>Tipo:</label>
              <input
                type='text'
                name='tipo'
                value={productData.tipo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group-item'>
              <label htmlFor='nome'>Nome:</label>
              <input
                type='text'
                name='nome'
                value={productData.nome}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group-item'>
              <label htmlFor='descricao'>Descrição:</label>
              <input
                type='text'
                name='descricao'
                value={productData.descricao}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group-item'>
              <label htmlFor='tamanho'>Tamanho:</label>
              <input
                type='text'
                name='tamanho'
                value={productData.tamanho}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group-item'>
              <label htmlFor='preco'>Preço:</label>
              <input
                type='text'
                name='preco'
                value={productData.preco}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group-item'>
              <label htmlFor='Nstock'>Nstock:</label>
              <input
                type='number'
                name='Nstock'
                value={productData.Nstock}
                onChange={handleInputChange}
                required
              />
            </div>
            <button className='btn edit-button additem' type='submit'><i className="animation"></i>Add item<i className="animation"></i></button>
          </form>
        </div>
        <div className="info-saved-modal" id="success-modal" style={{ display: 'none' }}>
              <p>Item added</p>
          </div>
      </div>
    );
}

export default AddProduct;
