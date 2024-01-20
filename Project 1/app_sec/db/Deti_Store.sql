Create Schema Deti;

/* Users*/



CREATE TABLE Deti.users (
    id INT IDENTITY(1,1) PRIMARY KEY,
	foto_url TEXT,
	 email VARCHAR(255) NOT NULL UNIQUE,
	 username VARCHAR(255) NOT NULL,
	 senha VARCHAR(255) NOT NULL,
	 salt VARCHAR(255),
	 nome VARCHAR(255),
	 passdate DATETIME,
	 isAdmin BIT
    );


INSERT INTO Deti.users (foto_url,email,username,senha,nome,passdate,isAdmin) values('foto_url','vasco@gmail.com','vasco','Olaola123','Vasco',GETDATE(),1)
INSERT INTO Deti.users (foto_url,email,username,senha,nome,passdate,isAdmin) values('foto_url','goncalo@gmail.com','goncalo','Olaola123','Goncalo Lopes',GETDATE(),1)
INSERT INTO Deti.users (foto_url,email,username,senha,nome,passdate,isAdmin) values('foto_url','tiago@gmail.com','tiago','Olaola123','Tiago',GETDATE(),1)
INSERT INTO Deti.users (foto_url,email,username,senha,nome,passdate,isAdmin) values('foto_url','rodrigo@gmail.com','rodrigo','Olaola123','Rodrigo',GETDATE(),1)
INSERT INTO Deti.users (foto_url,email,username,senha,nome,passdate,isAdmin) values('foto_url','couto@gmail.com','couto','Olaola123','Goncalo Couto',GETDATE(),1)





CREATE TABLE Deti.users_details (
	id INT Primary Key,
	morada VARCHAR(255),
	codigoPostal VARCHAR(8),
	cidade VARCHAR(255), 
	Ntelemovel VARCHAR(9),
	FOREIGN KEY (id) REFERENCES Deti.users(id)
    );


/*  Produtos */



CREATE TABLE Deti.produtos (
	id INT IDENTITY(1,1) PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
	descricao TEXT,
	preco DECIMAL(10, 2) NOT NULL,
	foto_url TEXT,
	tipo VARCHAR(255),
	tamanho VARCHAR(1),
	Nstock INT
    );

INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('DETI Cap','Hat for your sunny days',19.99,'foto1.jpg','Cap','M',20);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('DETI Cap','Hat for your sunny days',19.99,'foto2.jpg','Cap','S',7);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('White Hoodie DETI','Hoodie to code better in winter',49.99,'foto3.jpg','Hoodie','L',5);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('White Hoodie DETI','Hoodie to code better in winter',49.99,'foto4.jpg','Hoodie','M',2);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('White Hoodie DETI','Hoodie to code better in winter',49.99,'foto5.jpg','Hoodie','S',2);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('Hoodie Verde DETI','Hoodie to code better in winter',49.99,'foto6.jpg','Hoodie','M',6);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('Hoodie Verde DETI','Hoodie to code better in winter',49.99,'foto7.jpg','Hoodie','L',7);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('Black Hoodie DETI','Hoodie to code better in winter',49.99,'foto8.jpg','Hoodie','M',9);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('Grey Hoodie DETI','Hoodie to code better in winter',49.99,'foto9.jpg','Hoodie','M',9);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('Grey Hoodie DETI','Hoodie to code better in winter',49.99,'foto10.jpg','Hoodie','L',9);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('White T-Shirt  DETI','Shirt to make you feel good',34.99,'foto11.jpg','T-Shirt','M',10);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('White T-Shirt  DETI','Shirt to make you feel good',34.99,'foto12.jpg','T-Shirt','L',10);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('Green T-Shirt DETI','Shirt to make you feel good',34.99,'foto13.jpg','T-Shirt','M',10);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('Green T-Shirt DETI','Shirt to make you feel good',34.99,'foto14.jpg','T-Shirt','L',1);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('Black T-Shirt DETI','Shirt to make you feel good',34.99,'foto15.jpg','T-Shirt','M',2);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('Green Scarf DETI','Scarf to support your department',10.00,'foto16.jpg','Scarf',null,2);
INSERT INTO Deti.produtos (nome,descricao,preco,foto_url,tipo,tamanho,Nstock) values ('Green Scarf DETI','Scarf to support your department',10.00,'foto17.jpg','Scarf',null,2);



/* cart */

CREATE TABLE Deti.cart (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT,
	
    FOREIGN KEY (user_id) REFERENCES Deti.users(id),
    FOREIGN KEY (product_id) REFERENCES Deti.produtos(id)
);



/* Favoritos */




CREATE TABLE Deti.favoritos (
	id_user INT PRIMARY KEY,
	Product_id INT,
	FOREIGN KEY (id_user) REFERENCES Deti.users(id),
	FOREIGN KEY (Product_id) REFERENCES Deti.produtos(id)
		
    );




/* pedidos */


CREATE TABLE Deti.pedidos (
	id INT IDENTITY(1,1) PRIMARY KEY,
	id_user INT,
	Shipping_id INT,
	Payment_id INT,
	total DECIMAL(10,2),
	status INT,
	FOREIGN KEY (id_user) REFERENCES Deti.users(id)
    );

INSERT INTO Deti.pedidos (id_user, Shipping_id, Payment_id, total, status) VALUES (4, 1, 1, 0, 1);
INSERT INTO Deti.pedidos (id_user, Shipping_id, Payment_id, total, status) VALUES (4, 2, 2, 0, 2);
INSERT INTO Deti.pedidos (id_user, Shipping_id, Payment_id, total, status) VALUES (3, 1, 1, 0, 1);



/* pedidos_details */


CREATE TABLE Deti.pedidos_details (
	id INT IDENTITY(1,1) PRIMARY KEY,
	Order_id INT,
	Product_id INT,
	Product_name VARCHAR(255) NOT NULL,
	Product_size VARCHAR(1),
	Product_price DECIMAL(10,2) NOT NULL
    );

INSERT INTO Deti.pedidos_details (Order_id, Product_id, Product_name, Product_size, Product_price)
SELECT 1, id, nome, tamanho, preco
FROM Deti.produtos
WHERE id IN (1, 3, 2);

INSERT INTO Deti.pedidos_details (Order_id, Product_id, Product_name, Product_size, Product_price)
SELECT 2, id, nome, tamanho, preco
FROM Deti.produtos
WHERE id IN (15, 16); 


CREATE TABLE Deti.reviews (
	id INT IDENTITY(1,1) PRIMARY KEY,
	User_id INT,
	Product_id INT,
	Review TEXT,
	rating INT,
	review_date DATETIME,
	FOREIGN KEY (User_id) REFERENCES Deti.users(id),
	FOREIGN KEY (Product_id) REFERENCES Deti.produtos(id)
	);


CREATE TRIGGER CreateUserDetailsTrigger
ON Deti.users
AFTER INSERT
AS
BEGIN
    -- Inserção na tabela Deti.users_details com valores nulos
    INSERT INTO Deti.users_details (id, morada, codigoPostal, cidade, Ntelemovel)
    SELECT id, NULL, NULL, NULL, NULL
    FROM inserted;
END;








