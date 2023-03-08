CREATE TABLE usuario(
    Usr_Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Usr_Email VARCHAR(110) UNIQUE NOT NULL,
    Usr_Nome VARCHAR(80) NOT NULL,
    Usr_Senha VARCHAR(255) NOT NULL,
    Usr_Contato VARCHAR(20),
    Usr_CPF VARCHAR(11),
    Usr_Tipo CHAR(1) NOT NULL,
    Usr_FotoPerfil VARCHAR(255)
);

CREATE TABLE barbearia(
    Barb_Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Barb_Nome VARCHAR(255) NOT NULL,
    Barb_RazaoSocial VARCHAR(255) NOT NULL,
    Barb_CNPJ VARCHAR(14) NOT NULL,
    Barb_InscEst VARCHAR(20) NOT NULL,
    Barb_Cidade VARCHAR(80) NOT NULL,
    Barb_CEP VARCHAR(8) NOT NULL,
    Barb_UF VARCHAR(12) NOT NULL,
    Barb_Rua VARCHAR(80) NOT NULL,
    Barb_Numero INT NOT NULL,
    Barb_Bairro VARCHAR(80) NOT NULL,
    Barb_Complemento VARCHAR(50),
    Barb_GeoLatitude FLOAT,
    Barb_GeoLongitude FLOAT,
    Barb_LogoUrl VARCHAR(255)
);

CREATE TABLE barbearia_contatos(
    Barb_Codigo INT NOT NULL,
    BarbC_Descricao VARCHAR(100) NOT NULL,
    BarbC_Contato VARCHAR(20) NOT NULL
);

CREATE TABLE barbearia_proprietarios(
    Barb_Codigo INT NOT NULL,
    Usr_Codigo INT NOT NULL
);

CREATE TABLE servico_categorias(
    ServCat_Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Barb_Codigo INT NOT NULL,
    ServCat_Nome VARCHAR(150) NOT NULL
);

CREATE TABLE servico(
    Serv_Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Serv_Nome VARCHAR(55) NOT NULL,
    ServCat_Codigo INT NOT NULL,
    Serv_Valor FLOAT NOT NULL
);

ALTER TABLE barbearia_contatos ADD CONSTRAINT fk_contatos_barbearia
FOREIGN KEY(Barb_Codigo) REFERENCES barbearia(Barb_Codigo);

ALTER TABLE barbearia_proprietarios ADD CONSTRAINT pk_barbearia_proprietario
PRIMARY KEY(Barb_Codigo, Usr_Codigo);

ALTER TABLE barbearia_proprietarios ADD CONSTRAINT fk_barbearia_proprietario_barbeiro
FOREIGN KEY(Barb_Codigo) REFERENCES barbearia(Barb_Codigo);

ALTER TABLE barbearia_proprietarios ADD CONSTRAINT fk_barbearia_proprietario_usuario
FOREIGN KEY(Usr_Codigo) REFERENCES usuario(Usr_Codigo);

ALTER TABLE servico_categorias ADD CONSTRAINT fk_categoria_barbearia
FOREIGN KEY(Barb_Codigo) REFERENCES barbearia(Barb_Codigo);

ALTER TABLE servico ADD CONSTRAINT fk_servico_categoria
FOREIGN KEY(ServCat_Codigo) REFERENCES servico_categorias(ServCat_Codigo);