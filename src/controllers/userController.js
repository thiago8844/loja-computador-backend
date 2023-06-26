//Pacotes
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Models
const { Usuario, Endereco, Carrinho } = require("../models");

const userController = {
  async cadastro(req, res) {
    // -=-=-=- VERIFICAÇÃO DE ERROS -=-=-=-

    //Fazer as validações do express validator aqui
    const errorsVal = validationResult(req);
    //Verifica se o email e o cpf já existem
    const userExist = await Usuario.findOne({
      where: { email: req.body.email },
    });
    const cpfExist = await Usuario.findOne({ where: { cpf: req.body.cpf } });

    if (userExist) {
      errorsVal.errors.push({ msg: "Email já existente" });
    }

    if (cpfExist) {
      errorsVal.errors.push({ msg: "CPF já existente" });
    }
    console.log(errorsVal.errors);
    //Verifica se existem erros no express validator
    if (!errorsVal.isEmpty()) {
      return res.status(400).json(errorsVal.errors);
    }

    // -=-=-=- CRIAÇÃO DO CADASTRO -=-=-=-
    try {
      const {
        nome,
        email,
        cpf,
        data_nasc,
        telefone,
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        senha,
      } = req.body;

      const userInfo = {
        nome,
        email,
        cpf,
        data_nasc,
        telefone,
        senha: bcrypt.hashSync(senha, 10), //Faz o hash da senha
        adm: 0,
      };

      //Cria o usuário e pega o ID dele
      const {
        dataValues: { id_usuario },
      } = await Usuario.create(userInfo);

      const userAdress = {
        id_usuario,
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
      };

      //Cria a fileira do endereço daquele usuário
      await Endereco.create(userAdress);
      //Cria o carrinho do usuário
      await Carrinho.create({
        id_usuario,
      });

      res.status(200).json({ msg: "usuário criado com sucesso" });
    } catch (error) {
      res.status(400).json(error);
    }
  },

  async login(req, res) {
    const { email, senha } = req.body;

    try {
      console.log("Recebeu o request");
      const user = await Usuario.findOne({
        where: {
          email: email,
        },
      });

      if (user && bcrypt.compareSync(senha, user.dataValues.senha)) {
        //Caso ele já esteja logado desloga antes de fazer o login
        if (res.locals.isLogged) userController.logOut.bind(userController);

        const userData = user.dataValues;
        const userName = userData.nome.split(" ")[0];

        //Gera o token de autenticação
        const token = jwt.sign(
          { id: userData.id_usuario, email: userData.email, name: userName },
          "batata"
        );
        //Cria o cookie com o token
        return res.status(200).json({ token });
      } else {
        return res.status(401).json({ error: "Usuário ou senha incorretos" });
      }
    } catch (error) {
      console.error(error);
      return res.status(400).json(error);
    }
  },

  async sendUserData(req, res) {
    const { id: id_usuario } = jwt.decode(req.headers.authorization);
    try {
      const targetUser = await Usuario.findOne({ where: { id_usuario } });
      //Usuário não encontrado
      if (!targetUser) return res.status(404).send();
      delete targetUser.senha;
      return res.status(200).json(targetUser);
    } catch (error) {
      console.error(error);
      return res.status(400).send();
    }
  },

  async editUserData(req, res) {
    const { id: id_usuario } = jwt.decode(req.headers.authorization);
    const newUser = req.body;
    try {
      const targetUser = await Usuario.update(newUser, {
        where: { id_usuario },
      });
      //Usuário não encontrado
      if (!targetUser) return res.status(404).send();

      return res.status(200).send();
    } catch (error) {
      console.error(error);
      return res.status(400).send();
    }
  },

  async sendUserAddress(req, res) {
    const { id: id_usuario } = jwt.decode(req.headers.authorization);

    try {
      const address = await Endereco.findOne({ where: { id_usuario } });

      if (!address) return res.status(404).send();

      return res.status(200).json(address);
    } catch (error) {
      console.error(error);
      return res.status(400).send();
    }
  },
  async editUserAddress(req, res) {
    const { id: id_usuario } = jwt.decode(req.headers.authorization);
    const newAddress = req.body;
    console.log(newAddress)
    try {
      const targetAddress = await Endereco.update(newAddress, {
        where: { id_usuario },
      });
     
      //Endereco não encontrado
      if (!targetAddress) return res.status(404).send();

      return res.status(200).send();
    } catch (error) {
      console.error(error);
      return res.status(400).send();
    }
  },


};

module.exports = userController;
