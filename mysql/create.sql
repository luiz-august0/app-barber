CREATE TABLE usuario(
    Usr_Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Usr_Email VARCHAR(110) UNIQUE NOT NULL,
    Usr_Nome VARCHAR(80) NOT NULL,
    Usr_Senha VARCHAR(255) NOT NULL,
    Usr_Contato VARCHAR(20),
    Usr_CPF VARCHAR(11),
    Usr_Tipo CHAR(1) NOT NULL
);

CREATE TABLE barbearia(
    Barb_Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Barb_Nome VARCHAR(255) NOT NULL,
    Barb_RazaoSocial VARCHAR(255) NOT NULL,
    Barb_CNPJ VARCHAR(14) NOT NULL,
    Barb_InscEst VARCHAR(9) NOT NULL
);

CREATE TABLE barbearia_endereco(
    BarbEnd_Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Barb_Codigo INT NOT NULL,
    BarbEnd_Cidade VARCHAR(80) NOT NULL,
    BarbEnd_CEP VARCHAR(8) NOT NULL,
    BarbEnd_Rua VARCHAR(80) NOT NULL,
    BarbEnd_Numero INT NOT NULL,
    BarbEnd_Bairro VARCHAR(80) NOT NULL,
    BarbEnd_Complemento VARCHAR(50),
    BarbEnd_Contato1 VARCHAR(20) NOT NULL,
    BarbEnd_Contato2 VARCHAR(20),
    BarbEnd_Contato3 VARCHAR(20)
);

CREATE TABLE barbearia_proprietarios(
    Barb_Codigo INT NOT NULL,
    Usr_Codigo INT NOT NULL
);

CREATE TABLE servico_categorias(
    ServCat_Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Barb_Codigo INT NOT NULL,
    Serv_Cat_Nome VARCHAR(55) NOT NULL
);

CREATE TABLE servico(
    Serv_Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Serv_Nome VARCHAR(55) NOT NULL,
    ServCat_Codigo INT NOT NULL,
    Serv_Valor FLOAT NOT NULL
);

ALTER TABLE barbearia_endereco ADD CONSTRAINT fk_endereco_barbeiro
FOREIGN KEY(Barb_Codigo) REFERENCES barbearia(Barb_Codigo);

ALTER TABLE barbearia_proprietarios ADD CONSTRAINT pk_barbearia_proprietario
PRIMARY KEY(Barb_Codigo, Usr_Codigo);

ALTER TABLE servico_categorias ADD CONSTRAINT fk_categoria_barbearia
FOREIGN KEY(Barb_Codigo) REFERENCES barbearia(Barb_Codigo);

ALTER TABLE servico ADD CONSTRAINT fk_servico_categoria
FOREIGN KEY(ServCat_Codigo) REFERENCES servico_categorias(ServCat_Codigo);