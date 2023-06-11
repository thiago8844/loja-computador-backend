-- MySQL Script generated by MySQL Workbench
-- Sun May 14 22:18:51 2023
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema dados_loja_tech
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema dados_loja_tech
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `dados_loja_tech` DEFAULT CHARACTER SET utf8 ;
USE `dados_loja_tech` ;

-- -----------------------------------------------------
-- Table `dados_loja_tech`.`usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `dados_loja_tech`.`usuario` ;

CREATE TABLE IF NOT EXISTS `dados_loja_tech`.`usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(100) NOT NULL,
  `cpf` VARCHAR(45) NOT NULL,
  `telefone` VARCHAR(45) NOT NULL,
  `data_nasc` DATE NOT NULL,
  `adm` TINYINT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `senha_UNIQUE` (`senha` ASC) VISIBLE,
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC) VISIBLE,
  UNIQUE INDEX `id_usuario_UNIQUE` (`id_usuario` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dados_loja_tech`.`endereco`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `dados_loja_tech`.`endereco` ;

CREATE TABLE IF NOT EXISTS `dados_loja_tech`.`endereco` (
  `id_endereco` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `cep` VARCHAR(13) NOT NULL,
  `rua` VARCHAR(45) NOT NULL,
  `numero` INT NOT NULL,
  `bairro` VARCHAR(45) NOT NULL,
  `cidade` VARCHAR(45) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  `complemento` VARCHAR(45) NULL,
  PRIMARY KEY (`id_endereco`),
  INDEX `fk_endereco_usuario1_idx` (`id_usuario` ASC) VISIBLE,
  UNIQUE INDEX `id_endereco_UNIQUE` (`id_endereco` ASC) VISIBLE,
  CONSTRAINT `fk_endereco_usuario1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `dados_loja_tech`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dados_loja_tech`.`departamento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `dados_loja_tech`.`departamento` ;

CREATE TABLE IF NOT EXISTS `dados_loja_tech`.`departamento` (
  `id_departamento` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_departamento`),
  UNIQUE INDEX `id_departamento_UNIQUE` (`id_departamento` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dados_loja_tech`.`sub_departamento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `dados_loja_tech`.`sub_departamento` ;

CREATE TABLE IF NOT EXISTS `dados_loja_tech`.`sub_departamento` (
  `id_sub_departamento` INT NOT NULL AUTO_INCREMENT,
  `id_departamento` INT NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_sub_departamento`),
  INDEX `fk_sub_departamento_departamento1_idx` (`id_departamento` ASC) VISIBLE,
  UNIQUE INDEX `id_sub_departamento_UNIQUE` (`id_sub_departamento` ASC) VISIBLE,
  CONSTRAINT `fk_sub_departamento_departamento1`
    FOREIGN KEY (`id_departamento`)
    REFERENCES `dados_loja_tech`.`departamento` (`id_departamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dados_loja_tech`.`produto`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `dados_loja_tech`.`produto` ;

CREATE TABLE IF NOT EXISTS `dados_loja_tech`.`produto` (
  `id_produto` INT NOT NULL AUTO_INCREMENT,
  `produtocol` VARCHAR(45) NULL,
  `nome` VARCHAR(45) NOT NULL,
  `preco` DECIMAL(8,2) NOT NULL,
  `fabricante` VARCHAR(45) NULL,
  `sub_departamento` VARCHAR(45) NULL,
  `id_departamento` INT NOT NULL,
  `id_sub_departamento` INT NULL,
  `descricao` TEXT NULL,
  PRIMARY KEY (`id_produto`),
  INDEX `fk_produto_departamento1_idx` (`id_departamento` ASC) VISIBLE,
  INDEX `fk_produto_sub_departamento1_idx` (`id_sub_departamento` ASC) VISIBLE,
  UNIQUE INDEX `id_produto_UNIQUE` (`id_produto` ASC) VISIBLE,
  CONSTRAINT `fk_produto_departamento1`
    FOREIGN KEY (`id_departamento`)
    REFERENCES `dados_loja_tech`.`departamento` (`id_departamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_produto_sub_departamento1`
    FOREIGN KEY (`id_sub_departamento`)
    REFERENCES `dados_loja_tech`.`sub_departamento` (`id_sub_departamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dados_loja_tech`.`pedido`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `dados_loja_tech`.`pedido` ;

CREATE TABLE IF NOT EXISTS `dados_loja_tech`.`pedido` (
  `id_pedido` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `valor_total` DECIMAL(9,2) NOT NULL,
  `data` DATE NOT NULL,
  `status` VARCHAR(45) NULL,
  PRIMARY KEY (`id_pedido`),
  INDEX `fk_pedido_usuario1_idx` (`id_usuario` ASC) VISIBLE,
  UNIQUE INDEX `id_pedido_UNIQUE` (`id_pedido` ASC) VISIBLE,
  CONSTRAINT `fk_pedido_usuario1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `dados_loja_tech`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dados_loja_tech`.`carrinho`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `dados_loja_tech`.`carrinho` ;

CREATE TABLE IF NOT EXISTS `dados_loja_tech`.`carrinho` (
  `id_carrinho` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `valor_total` DECIMAL(9,2) NULL,
  PRIMARY KEY (`id_carrinho`, `id_usuario`),
  INDEX `fk_carrinho_usuario1_idx` (`id_usuario` ASC) VISIBLE,
  UNIQUE INDEX `id_carrinho_UNIQUE` (`id_carrinho` ASC) VISIBLE,
  CONSTRAINT `fk_carrinho_usuario1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `dados_loja_tech`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dados_loja_tech`.`item_pedido`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `dados_loja_tech`.`item_pedido` ;

CREATE TABLE IF NOT EXISTS `dados_loja_tech`.`item_pedido` (
  `id_produto` INT NOT NULL,
  `id_pedido` INT NOT NULL,
  `quantidade` INT NULL,
  `item_pedidocol` VARCHAR(45) NULL,
  PRIMARY KEY (`id_produto`, `id_pedido`),
  INDEX `fk_produto_has_pedido_pedido1_idx` (`id_pedido` ASC) VISIBLE,
  INDEX `fk_produto_has_pedido_produto1_idx` (`id_produto` ASC) VISIBLE,
  CONSTRAINT `fk_produto_has_pedido_produto1`
    FOREIGN KEY (`id_produto`)
    REFERENCES `dados_loja_tech`.`produto` (`id_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_produto_has_pedido_pedido1`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `dados_loja_tech`.`pedido` (`id_pedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dados_loja_tech`.`item_carrinho`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `dados_loja_tech`.`item_carrinho` ;

CREATE TABLE IF NOT EXISTS `dados_loja_tech`.`item_carrinho` (
  `id_produto` INT NOT NULL,
  `id_carrinho` INT NOT NULL,
  `quantidade` INT NULL,
  PRIMARY KEY (`id_produto`, `id_carrinho`),
  INDEX `fk_produto_has_carrinho_carrinho1_idx` (`id_carrinho` ASC) VISIBLE,
  INDEX `fk_produto_has_carrinho_produto1_idx` (`id_produto` ASC) VISIBLE,
  CONSTRAINT `fk_produto_has_carrinho_produto1`
    FOREIGN KEY (`id_produto`)
    REFERENCES `dados_loja_tech`.`produto` (`id_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_produto_has_carrinho_carrinho1`
    FOREIGN KEY (`id_carrinho`)
    REFERENCES `dados_loja_tech`.`carrinho` (`id_carrinho`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dados_loja_tech`.`imagem`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `dados_loja_tech`.`imagem` ;

CREATE TABLE IF NOT EXISTS `dados_loja_tech`.`imagem` (
  `id_imagem` INT NOT NULL AUTO_INCREMENT,
  `id_produto` INT NOT NULL,
  `caminho` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_imagem`),
  UNIQUE INDEX `id_imagem_UNIQUE` (`id_imagem` ASC) VISIBLE,
  INDEX `fk_imagem_produto1_idx` (`id_produto` ASC) VISIBLE,
  CONSTRAINT `fk_imagem_produto1`
    FOREIGN KEY (`id_produto`)
    REFERENCES `dados_loja_tech`.`produto` (`id_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
