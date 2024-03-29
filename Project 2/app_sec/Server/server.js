const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

require('dotenv').config();


const client_id = '';
const client_secret = '';

app.use(cors());

const rateLimit = require('express-rate-limit');


const limiter = rateLimit({
  windowMs: 15*60*1000, //15min
  max: 100,  //100 max
  standardHeaders: true, 
  legacyHeaders: false,
});

app.use(limiter);


const sixtyDaysInSeconds = 15724800; 
app.use(helmet.hsts({
  maxAge: sixtyDaysInSeconds,
  includeSubDomains: true 
}));

app.use(helmet());


app.use(express.json());

app.listen(5000, () => {
  console.log('Server started on port 5000');
});

const sql = require('mssql');

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, 
};

app.use(cors(corsOptions));


const config = {
  user: 'SA',
  password: 'Olaola123',
  server: 'localhost',
  database: 'Deti_Store',
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

app.use(cookieParser());

const pool = new sql.ConnectionPool(config);

const JWT_SECRET = process.env.JWT_SECRET || 'a3Zb2Cf7gH1jK4lM9oQ0rS5tU8xY1wD3'; //nao deve ser assim, nao deve ser guardado em lado nenhum mas e para experimentar


pool.connect()
  .then(() => {
    console.log('Connection to SQL Server established.');
    atualizarPass(pool);
  })
  .catch(err => {
    console.error('Error connecting to SQL Server:', err);
  });

  //encriptar pass de admins

  async function atualizarPass(connection) {
    const userIdsToUpdate = [1, 2, 3, 4, 5];
  
    for (const userId of userIdsToUpdate) {
      const request = connection.request();
      request.input('userId', userId);
  
      try {
        const result = await request.query('SELECT * FROM Deti.users WHERE id = @userId');
  
        if (result.recordset.length > 0) {
          const user = result.recordset[0];
  
          if (user.senha) {
            if (!user.senha.startsWith('$2b$')) {
              const saltRounds = 10;
              const salt = await bcrypt.genSalt(saltRounds);
              const passwordWithSecondHash = await bcrypt.hash(user.senha, salt);
              const newPassword = await bcrypt.hash(passwordWithSecondHash, 10);
  
              const updateRequest = connection.request();
              updateRequest.input('newPassword', newPassword);
              updateRequest.input('salt', salt);
              updateRequest.input('userId', userId);
              await updateRequest.query('UPDATE Deti.users SET senha = @newPassword, salt = @salt WHERE id = @userId');
              console.log(`Senha do usuário ${userId} atualizada com sucesso.`);
            } else {
              console.log(`Senha do usuário ${userId} já está encriptada.`);
            }
          } else {
            console.log(`Usuário com ID ${userId} não possui senha definida.`);
          }
        } else {
          console.log(`Usuário com ID ${userId} não encontrado.`);
        }
      } catch (error) {
        console.error('Erro ao atualizar a senha do usuário:', error);
      }
    }
  }
  
  // ...
  
  app.get('/api/profile', async function (req, res) {
    console.log(req.query.code);
    console.log(process.env.CLIENT_ID);
    console.log(process.env.CLIENT_SECRET);
    const params = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: req.query.code
  });

  try {
      const response = await fetch(`https://github.com/login/oauth/access_token`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
          },
          body: params
      });

        const data = await response.json();

        if (data.access_token) {
        
            
            await createUserAndSetCookie(data.access_token, res,pool);
        } else {
            res.status(400).json({ error: 'Failed to obtain access token' });
        }

    } catch (error) {
        console.error('Error fetching GitHub access token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function createUserAndSetCookie(accessToken, res, pool) {
  try {
      const userResponse = await fetch('https://api.github.com/user', {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          }
      });
      const userData = await userResponse.json();

      console.log(userData);

      let userId;

      const request = pool.request();

      const username=userData.login;

      console.log(username);
      request.input('username', sql.VarChar, username || '');
      request.input('email', sql.VarChar, userData.email || '');
      request.input('foto_url', sql.Text, userData.avatar_url || 'foto.jpg');

      let query = 'SELECT * FROM Deti.users WHERE username = @username OR email = @email';
      let result = await request.query(query);

      if (!result.recordset.length) {
        query = `
        INSERT INTO Deti.users (username, email, foto_url, senha, isAdmin)
        VALUES (@username, @email, @foto_url, @senha, 0);
      
        SELECT SCOPE_IDENTITY() AS id;
      `;
      request.input('senha', sql.VarChar, 'DEFAULT_PASSWORD_NOT_USED');
          result = await request.query(query);
          userId = result.recordset[0].id;
      } else {
          userId = result.recordset[0].id;
      }

      console.log(userId);

      const token = jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: '10m' });
      res.cookie('sessionToken', token, { httpOnly: true, secure: true, maxAge: 10 * 60 * 1000, sameSite: 'Lax' });
      res.redirect('http://localhost:3000/');
      console.log("Success");
  } catch (error) {
      console.error('Error in createUserAndSetCookie:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}




app.get('/getAccessToken', async (req, res) => {
  try {
    console.log(req.query.code);
    const code = req.query.code;
    const params = `client_id=${client_id}&client_secret=${client_secret}&code=${code}`;

    const response = await fetch(`https://github.com/login/oauth/access_token?${params}`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
    });

    const data = await response.json();

    if (data.access_token) {
      res.json({ access_token: data.access_token });
    } else {
      res.status(400).json({ error: 'Failed to obtain access token' });
    }
  } catch (error) {
    console.error('Error in /getAccessToken:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/getUserData', async (req, res) => {
  try {
    const access_token = req.headers.authorization.split(' ')[1];

    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error in /getUserData:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//fim de encriptar 

app.use('/public/Images', function(req, res, next) {
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

  
  app.use('/public', express.static(path.join(__dirname, 'public')));

  app.post('/api/logout', (req, res) => {
    try {
      res.cookie('sessionToken', '', {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
        sameSite: 'Lax'
      });
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  const verifyJwt = (req, res, next) => {
    const token = req.cookies.sessionToken; 
  
    if (!token) {
      return res.status(401).json({ auth: false, message: "Token is missing" });
    } else {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          res.status(401).json({ auth: false, message: "Failed to authenticate token" });
        } else {
          req.userId = decoded.userId;
          next();
        }
      });
    }
  };
  

  app.get('/api/authstatus', verifyJwt, (req, res) => {
    return res.json({ userId: req.userId, auth: true });
  });

  app.use(cookieParser());
  
  
  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const request = pool.request();
      request.input('username', sql.VarChar, username);
  
      const result = await request.query(
        'SELECT * FROM Deti.users WHERE username = @username'
      );
  
      if (result.recordset.length === 1) {
        const user = result.recordset[0];
        const storedPassword = user.senha;
        const salt = user.salt;
  
        if (storedPassword && salt) {
          
          const passwordWithoutSalt = await bcrypt.hash(password, salt);
  
          const isPasswordMatch = await bcrypt.compare(passwordWithoutSalt, storedPassword);
  
          if (isPasswordMatch) {
          
            const token = jwt.sign(
              { userId: user.id }, 
              JWT_SECRET,          
              { expiresIn: 10*60*1000 }
            );

            res.cookie('sessionToken', token, {
              httpOnly: true,
              secure: true, 
              maxAge: 10 * 60 * 1000,
              sameSite: 'Lax'
            });

           
              res.json({ success: true, user_id: user.id, message: 'Login bem-sucedido' });
          } else {
            res.status(401).json({ error: 'Credenciais inválidas' });
          }
        } else {
          res.status(401).json({ error: 'Credenciais inválidas' });
        }
      } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
      }
    } catch (error) {
      console.error('Erro ao verificar as credenciais do usuário:', error);
      res.status(500).json({ error: 'Erro ao verificar as credenciais do usuário' });
    }
  });
  
  
  

  
  
  const saltRounds = 10; 
  
  app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {

      const normalizedPassword = password.replace(/\s+/g, ' ').trim();
      if (normalizedPassword.length < 12) {
        return res.status(400).json({ error: 'Password must be at least 12 characters long.' });
      }

      if (normalizedPassword.length >128){
        return res.status(400).json({error: 'Password must not be longer than 128 characters'})
      }

    const breached = await checkPasswordAgainstBreaches(normalizedPassword);
    if (breached) {
      return res.status(400).json({ error: 'This password has been breached before. Please use a different password.' });
    }
    
      const salt = await bcrypt.genSalt(saltRounds);
  
      const hash = await bcrypt.hash(normalizedPassword, salt);
  
      
      const secondHash = await bcrypt.hash(hash, 10); 

      const passdate = new Date().toISOString();
  
      const request = pool.request();
      request.input('username', sql.VarChar, username);
      request.input('email', sql.VarChar, email);
      request.input('password', sql.VarChar, secondHash);
      request.input('salt', sql.VarChar, salt); 
      request.input('foto_url', sql.Text, 'foto.jpg');
      request.input('passdate', sql.DateTime, passdate);
  
      const query = 
        'INSERT INTO Deti.users (username, email, senha, salt, foto_url,passdate, isAdmin) VALUES (@username, @email, @password, @salt, @foto_url, @passdate, 0)'
      const result = await request.query(query);

      res.json({ success: true, message: 'Registro bem-sucedido' });
      
    } catch (error) {
      console.error('Erro ao registrar o usuário:', error);
      res.status(500).json({ error: 'Erro ao registrar o usuário' });
    }
  });



app.get('/api/produtos', async (req, res) => {
  try {
   
    await sql.connect(config);

  
    const result = await sql.query('SELECT * FROM Deti.produtos');

    
    await sql.close();

    
    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao obter dados da tabela:', error);
    res.status(500).json({ error: 'Erro ao obter dados da tabela' });
  }
});


app.get('/api/loggeduser/:user_id', async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const request = pool.request();
    request.input('user_id', sql.Int, user_id);

    const result = await request.query(`
      SELECT u.id, u.username, u.email, u.foto_url, u.nome , u.isAdmin, ud.morada, ud.codigoPostal, ud.Ntelemovel , ud.cidade
      FROM Deti.users u
      LEFT JOIN Deti.users_details ud ON u.id = ud.id
      WHERE u.id = @user_id
    `);

    if (result.recordset.length === 1) {
      const userInfo = result.recordset[0];
      res.json(userInfo);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar informações do usuário' });
  }
});


app.use(bodyParser.json());

app.post('/api/editprofile', async (req, res) => {
  try {
    const {
      id,
      nome,
      email,
      morada,
      codigoPostal,
      cidade,
      contacto
    } = req.body;

    
  
    const request = pool.request();
  request.input('id', sql.Int, id);
  request.input('rua', sql.VarChar, morada);
  request.input('codigoPostal', sql.VarChar, codigoPostal);
  request.input('cidade', sql.VarChar, cidade);
  request.input('contacto', sql.VarChar, contacto);

  const updateUserDetailsQuery = `
    UPDATE Deti.users_details
    SET morada = @rua, codigoPostal = @codigoPostal, cidade = @cidade, Ntelemovel = @contacto
    WHERE id = @id
  `;
  await request.query(updateUserDetailsQuery);

  // Atualize os dados do usuário em Deti.users
  const updateUserQuery = `
    UPDATE Deti.users
    SET nome = @nome, email = @email
    WHERE id = @id
  `;
  request.input('nome', sql.VarChar, nome);
  request.input('email', sql.VarChar, email);
  await request.query(updateUserQuery);


    res.status(200).json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar o perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar o perfil' });
  }
});

app.use(bodyParser.json());

app.post('/api/updateitems', async (req,res) => {
  try{
    const{
      id,
      tipo,
      nome,
      descricao,
      tamanho,
      preco,
      Nstock,
    } = req.body;


    const request = pool.request();
    request.input('id', sql.Int, id);
    request.input('tipo', sql.VarChar, tipo);
    request.input('nome', sql.VarChar, nome);
    request.input('descricao', sql.VarChar, descricao);
    request.input('tamanho', sql.VarChar, tamanho);
    request.input('preco', sql.VarChar, preco);
    request.input('Nstock', sql.Int, Nstock);


    const updateitemsinfo =`
    UPDATE Deti.produtos
    SET tipo = @tipo, nome = @nome, descricao = @descricao, tamanho = @tamanho, preco = @preco , Nstock= @Nstock
    WHERE id = @id`;

    await request.query(updateitemsinfo);

    res.status(200).json({ message: 'Item atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar o item:', error);
    res.status(500).json({ error: 'Erro ao atualizar o item' });
  }

});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'Images'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/api/insertitems', upload.single('foto_url'), async (req, res) => {
  try {
    const {
      tipo,
      nome,
      descricao,
      tamanho,
      preco,
      Nstock,
    } = req.body;

    console.log(tipo);
    console.log(nome);
    console.log(descricao);
    console.log(tamanho);
    console.log(preco);
    console.log(Nstock);

    const request = pool.request();
    request.input('tipo', sql.VarChar, tipo);
    request.input('nome', sql.VarChar, nome);
    request.input('foto_url', sql.VarChar, req.file.filename); // Use o nome do arquivo gerado pelo multer
    request.input('descricao', sql.VarChar, descricao);
    request.input('tamanho', sql.VarChar, tamanho);
    request.input('preco', sql.VarChar, preco);
    request.input('Nstock', sql.Int, Nstock);

    const insertItemsQuery = `
      INSERT INTO Deti.produtos (tipo, nome, descricao, foto_url, tamanho, preco, Nstock)
      VALUES (@tipo, @nome, @descricao, @foto_url, @tamanho, @preco, @Nstock)
    `;

    await request.query(insertItemsQuery);

    res.status(200).json({ message: 'Item inserido com sucesso' });
  } catch (error) {
    console.error('Erro ao inserir o item:', error);
    res.status(500).json({ error: 'Erro ao inserir o item' });
  }
});

app.delete('/api/deleteitem/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const request = pool.request();
    request.input('itemId', sql.Int, itemId);

   
    const deleteItemQuery = `
      DELETE FROM Deti.produtos
      WHERE id = @itemId
    `;

    await request.query(deleteItemQuery);

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting the item:', error);
    res.status(500).json({ error: 'Error deleting the item' });
  }
});


app.use(bodyParser.json());


app.post('/api/reset-password', async (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res.status(400).json({ success: false, error: 'Credenciais inválidas.' });
  }

  try {


    const normalizedPassword = newPassword.replace(/\s+/g, ' ').trim();
    if (normalizedPassword.length < 12) {
      return res.status(400).json({ error: 'Password must be at least 12 characters long.' });
    }

    if (normalizedPassword.length >128){
      return res.status(400).json({error: 'Password must not be longer than 128 characters'})
    }


    const request = pool.request();
    request.input('username', sql.VarChar, username);

    const result = await request.query(
      'SELECT * FROM Deti.users WHERE username = @username'
    );

    if (result.recordset.length === 1) {
      const user = result.recordset[0];

      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);

      const currentDate = new Date().toISOString(); 

      const newPasswordHash = await bcrypt.hash(normalizedPassword, salt);

      const finalHashedPassword = await bcrypt.hash(newPasswordHash, 10);

      const updateRequest = pool.request();
      updateRequest.input('newPassword', sql.VarChar, finalHashedPassword);
      updateRequest.input('salt', sql.VarChar, salt);
      updateRequest.input('username', sql.VarChar, username);
      updateRequest.input('passdate', sql.DateTime, currentDate);

      const updateResult = await updateRequest.query(
        'UPDATE Deti.users SET senha = @newPassword, salt = @salt, passdate = @passdate WHERE username = @username'
      );

      if (updateResult.rowsAffected[0] === 1) {
        res.json({ success: true, message: 'Senha redefinida com sucesso' });
      } else {
        res.status(500).json({ success: false, error: 'Erro ao atualizar a senha' });
      }
    } else {
      res.status(401).json({ success: false, error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('Erro ao redefinir a senha:', error);
    res.status(500).json({ success: false, error: 'Erro interno.' });
  }
});


app.get('/api/myorders', async (req, res) => {
  const userId = req.header('userId'); // Assuming 'userId' is passed in the request header

  try {
    const request = pool.request();
    request.input('userId', userId); // Specify the data type if necessary
    console.log(userId);

    const query = `SELECT
      p.id AS order_id,
      (
        SELECT SUM(pd.Product_price)
        FROM Deti.pedidos_details pd
        WHERE pd.Order_id = p.id
      ) AS total,
      p.status,
      pd.id AS detail_id,
      pd.Product_id,
      pd.Product_name,
      pd.Product_size,
      pd.Product_price
    FROM Deti.pedidos p
    INNER JOIN Deti.pedidos_details pd ON p.id = pd.Order_id
    WHERE p.id_user = @userId;`;

    const result = await request.query(query);

    console.log(result.recordset); // Adicione esta linha para depurar os dados

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching user orders from the API:', error);
    res.status(500).json({ error: 'Error fetching user orders from the API' });
  }
});



app.get('/api/detailproduct/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // Certifique-se de que a conexão com o banco de dados foi configurada corretamente
    if (!pool) {
      throw new Error('Conexão com o banco de dados não está configurada.');
    }

    const request = pool.request();
    request.input('productId', sql.Int, productId);

    const result = await request.query(`
      SELECT * FROM Deti.produtos WHERE id = @productId
    `);

    if (result.recordset.length === 1) {
      const product = result.recordset[0];
      res.json(product);
    } else {
      // Retorne um status 404 se o produto não for encontrado
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar informações do produto:', error);

    // Retorne um status 500 com uma mensagem de erro
    res.status(500).json({ error: 'Erro interno do servidor', errorMessage: error.message });
  }
});



app.get('/api/produtos/search', async (req, res) => {
  try {
    const searchQuery = req.query.query;
    const category = req.query.category; 
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

    await sql.connect(config);

    let sqlQuery = `SELECT * FROM Deti.produtos WHERE nome LIKE '%${searchQuery}%'`;
    //console.log("CATEGORIA: ", category);

    if (category) {
      sqlQuery += ` AND tipo LIKE '%${category}%'`;
    }

    sqlQuery += ` AND preco BETWEEN ${minPrice} AND ${maxPrice}`;


    const result = await sql.query(sqlQuery);

    //console.log("RESULTADO: ", result);

    await sql.close();

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar dados da tabela:', error);
    res.status(500).json({ error: 'Erro ao buscar dados da tabela' });
  }
});


//Favourites


// API endpoint to get user's favorite products
app.get('/api/favorites/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const request = pool.request();
    request.input('userId', userId);

    const query = `
      SELECT p.id AS product_id, p.nome AS product_name
      FROM Deti.favoritos f
      INNER JOIN Deti.produtos p ON f.Product_id = p.id
      WHERE f.id_user = @userId
    `;

    const favoriteProducts = await request.query(query);

    res.status(200).json(favoriteProducts.recordset);
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    res.status(500).json({ error: 'Error fetching user favorites' });
  }
});



app.post('/api/favorites/add', async (req, res) => {
  const userId = req.body.userId;
  const productId = req.body.productId;

  try {
    // Check if the product is already in favorites
    const request = pool.request();
    request.input('userId', userId);
    request.input('productId', productId);

    const checkQuery = `
      SELECT * FROM Deti.favoritos
      WHERE id_user = @userId
      AND Product_id = @productId
    `;

    const existingFavorite = await request.query(checkQuery);

    if (existingFavorite.recordset.length === 0) {
      // If the product is not in favorites, add it
      const insertQuery = `
        INSERT INTO Deti.favoritos (id_user, Product_id)
        VALUES (@userId, @productId)
      `;

      await request.query(insertQuery);

      res.status(200).json({ message: 'Product added to favorites successfully' });
    } else {
      res.status(200).json({ message: 'Product is already in favorites' });
    }
  } catch (error) {
    console.error('Error adding product to favorites:', error);
    res.status(500).json({ error: 'Error adding product to favorites' });
  }
});


// API endpoint to remove a favorite product
app.delete('/api/favorites/remove', async (req, res) => {
  const userId = req.body.userId;
  const productId = req.body.productId;

  try {
    const request = pool.request();
    request.input('userId', userId);
    request.input('productId', productId);

    const deleteQuery = `
      DELETE FROM Deti.favoritos
      WHERE id_user = @userId AND Product_id = @productId
    `;

    const result = await request.query(deleteQuery);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Product removed from favorites successfully' });
    } else {
      res.status(404).json({ error: 'Product not found in favorites' });
    }
  } catch (error) {
    console.error('Error removing product from favorites:', error);
    res.status(500).json({ error: 'Error removing product from favorites' });
  }
});



app.get('/api/productreviews/:id', async (req, res) => {
  const productId = req.params.id;
  try {
   
    const query = `
      SELECT R.*, U.nome AS username
      FROM Deti.reviews AS R
      JOIN Deti.users AS U ON R.User_id = U.id
      WHERE R.Product_id = @productId
    `;
    const request = pool.request();
    request.input('productId', sql.Int, productId);
    const result = await request.query(query);

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao obter as avaliações do produto:', error);
    res.status(500).json({ error: 'Erro ao obter as avaliações do produto' });
  }
});

app.post('/api/addreview', async (req, res) => {
  
  const { userId, productId, reviewText, rating } = req.body;

  try {
  
    const query = `
      INSERT INTO Deti.reviews (User_id, Product_id, Review, rating, review_date)
      VALUES (@userId, @productId, @reviewText, @rating, GETDATE());
    `;

    
    const request = pool.request();
    request.input('userId', sql.Int, userId);
    request.input('productId', sql.Int, productId);
    request.input('reviewText', sql.Text, reviewText);
    request.input('rating', sql.Int, rating);
    await request.query(query);


    res.json({ success: true, message: 'Avaliação adicionada com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar a avaliação:', error);
    res.status(500).json({ error: 'Erro ao adicionar a avaliação' });
  }
});




//Shopping Cart

// API endpoint to add a product to the cart 
app.post('/api/cart/add', async (req, res) => {
  const userId = req.body.userId;
  const quantity = req.body.quantity;
  const product = req.body.Product;
  const productId = product.id;
  const Nstock = product.Nstock;

  try {
    const request = pool.request();
    request.input('userId', userId);
    request.input('productId', productId);
    const checkQuery = `
      SELECT * FROM Deti.cart
      WHERE user_id = @userId
      AND product_id = @productId
    `;
    const existingCartItem = await request.query(checkQuery);
    
    if (existingCartItem.recordset.length > 0) {
      const existingQuantity = existingCartItem.recordset[0].quantity;
      
      if(existingQuantity < Nstock){
        const newQuantity = existingQuantity + quantity;
        
        const updateQuery = `
          UPDATE Deti.cart
          SET quantity = @newQuantity
          WHERE user_id = @userId
          AND product_id = @productId
        `;
        request.input('newQuantity', newQuantity);
        await request.query(updateQuery);

        res.status(200).json({ message: 'Product quantity updated in the cart' });
      }
      else{
        res.status(500).json({ error: 'Exceeds available stock' });
      }
    } else if (quantity <= Nstock) {
      request.input('quantity', quantity);
    
      const insertQuery = `
        INSERT INTO Deti.cart (user_id, product_id, quantity)
        VALUES (@userId, @productId, @quantity)
      `;
      await request.query(insertQuery);

      res.status(200).json({ message: 'Product added to cart successfully' });
    } else {
      res.status(400).json({ error: 'We dont have that product in stock' });
    }
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Error adding product to cart' });
  }
});


app.get('/api/cart/items/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const request = pool.request();
    request.input('userId', userId);

    const query = `
      SELECT p.id, p.nome, c.quantity, p.preco, p.tamanho, p.foto_url
      FROM Deti.cart AS c
      INNER JOIN Deti.produtos AS p ON c.product_id = p.id
      WHERE c.user_id = @userId
    `;

    const cartItems = await request.query(query);

    res.status(200).json(cartItems.recordset);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Error fetching cart items' });
  }
});

app.post('/api/cart/update', async (req, res) => {

  const userId = req.body.userId;
  const productId = req.body.product.id;
  const newQuantity = req.body.quantity;
  // console.log("userID: ", userId);
  // console.log("productId: ", productId);
  //console.log("newQuantity: ", newQuantity);


  try {
    // Check if the item exists in the cart
    const request = pool.request();
    request.input('userId', userId);
    request.input('productId', productId);

    const checkQuery = `
      SELECT * FROM Deti.cart
      WHERE user_id = @userId
      AND product_id = @productId
    `;

    const existingCartItem = await request.query(checkQuery);
    

    if (existingCartItem.recordset.length > 0) {
      

      const stockQuery = `
        SELECT Nstock
        FROM Deti.produtos
        WHERE id = @productId;
      `;
      const stockResult = await request.query(stockQuery);
      const Nstock = stockResult.recordset[0].Nstock;

      request.input('newQuantity', newQuantity);
      if (newQuantity <1) {
        res.status(500).json({ error: 'Invalid quantity' });

      }else if (newQuantity <= Nstock) {
        const updateQuery = `
          UPDATE Deti.cart
          SET quantity = @newQuantity
          WHERE user_id = @userId
          AND product_id = @productId
        `;
        await request.query(updateQuery);

        res.status(200).json({ message: 'Item quantity updated in the cart' });
      } else {
        res.status(400).json(Nstock);
        
      }
    } else {
      res.status(404).json({ error: 'Item not found in the cart' });
    }
  } catch (error) {
    console.error('Error updating item quantity in the cart:', error);
    res.status(500).json({ error: 'Error updating item quantity in the cart' });
  }
});

app.get('/api/product/nstock/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const request = pool.request();
    request.input('productId', productId);

    const query = `
      SELECT Nstock
      FROM Deti.produtos
      WHERE id = @productId
    `;

    const result = await request.query(query);

    if (result.recordset.length > 0) {
      const nStockValue = result.recordset[0].Nstock;
      res.status(200).json({ Nstock: nStockValue });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching Nstock for the product:', error);
    res.status(500).json({ error: 'Error fetching Nstock for the product' });
  }
});





app.delete('/api/cart/remove', async (req, res) => {
  const userId = req.body.userId;
  const productId = req.body.productId;

  try {
    const request = pool.request();
    request.input('userId', userId);
    request.input('productId', productId);

    const checkQuery = `
      SELECT * FROM Deti.cart
      WHERE user_id = @userId
      AND product_id = @productId
    `;

    const existingCartItem = await request.query(checkQuery);

    if (existingCartItem.recordset.length > 0) {
      const deleteQuery = `
        DELETE FROM Deti.cart
        WHERE user_id = @userId
        AND product_id = @productId
      `;

      await request.query(deleteQuery);

      res.status(200).json({ message: 'Item removido com sucesso do carrinho' });
    } else {
      res.status(404).json({ error: 'Item não encontrado no carrinho' });
    }
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    res.status(500).json({ error: 'Erro ao remover item do carrinho' });
  }
});


app.get('/api/cart/total/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const request = pool.request();
    request.input('userId', userId);

    const query = `
      SELECT SUM(p.preco * c.quantity) AS total
      FROM Deti.cart AS c
      INNER JOIN Deti.produtos AS p ON c.product_id = p.id
      WHERE c.user_id = @userId
    `;

    const result = await request.query(query);

    if (result.recordset.length > 0 && result.recordset[0].total !== null) {
      const totalValue = result.recordset[0].total.toFixed(2);
      res.status(200).json({ total: totalValue });
    } else {
      res.status(404).json({ error: 'Cart is empty or user not found' });
    }
  } catch (error) {
    console.error('Error calculating cart total:', error);
    res.status(500).json({ error: 'Error calculating cart total' });
  }
});



app.delete('/api/cart/clear', async (req, res) => {
  const userId = req.body.userId;

  try {
    const request = pool.request();
    request.input('userId', userId);

    const clearQuery = `
      DELETE FROM Deti.cart
      WHERE user_id = @userId
    `;

    await request.query(clearQuery);

    res.status(200).json({ message: 'Carrinho esvaziado com sucesso' });
  } catch (error) {
    console.error('Erro ao esvaziar o carrinho:', error);
    res.status(500).json({ error: 'Erro ao esvaziar o carrinho' });
  }
});


const checkPasswordAgainstBreaches = async (password) => {
  const sha1Password = crypto.createHash('sha1').update(password).digest('hex');
  const prefix = sha1Password.slice(0, 5);
  const suffix = sha1Password.slice(5).toUpperCase();

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await response.text();
  const hashes = text.split('\r\n').map(line => line.split(':')[0]);

  return hashes.includes(suffix);
};



