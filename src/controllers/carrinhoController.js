//Pacotes
const { Op } = require("sequelize"); //Módulo de operadores sequelize
const jwt = require("jsonwebtoken");

//Models
const { Carrinho, Item_carrinho, Produto, Imagem } = require("../models");

const carrinho = {
  
  async adicionaProduto(req, res) {
    const { user_id: id_usuario, id_produto } = req.body;

    try {
      const userCarrinho = await Carrinho.findOne({
        where: { id_usuario },
        raw: true,
      });

      //Verifica se o item já está no carrinho
      const item = await Item_carrinho.findOne({
        where: {
          [Op.and]: {
            id_produto,
            id_carrinho: userCarrinho.id_carrinho,
          },
        },
      });

      if (!item) {
        const itemNovo = {
          id_produto,
          id_carrinho: userCarrinho.id_carrinho,
          quantidade: 1,
        };

        try {
          const produtoAdd = await Item_carrinho.create(itemNovo);

          return res.json({ produtoAdicionado: true });
        } catch (error) {
          return res.json({ produtoAdicionado: false, error });
        }
      } else
        return res.status(200).json({
          produtoAdicionado: true,
          error: "Produto já existente",
        });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ produtoAdicionado: false, error });
    }
  },

  async getUserProducts(req, res) {
    const id_usuario = req.params.id;

    try {
      const userCarrinho = await Carrinho.findOne({
        where: { id_usuario },
        raw: true,
      });

      const items_carrinho = await Item_carrinho.findAll({
        where: { id_carrinho: userCarrinho.id_carrinho },
        raw: true,
      });
      const id_produtos = items_carrinho.map((p) => p.id_produto);

      const userProducts = await Produto.findAll({
        where: {
          id_produto: { [Op.in]: id_produtos },
        },
        raw: true,
      });

      userProducts.forEach((p, i) => {
        p.quantidade = items_carrinho[i].quantidade;
      });

      return res.status(200).json(userProducts);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error, msg: "Erro ao requisitar os produtos" });
    }
  },

  async changeUserProductAmount(req, res) {
    const id_usuario = req.params.id;
    const id_produto = req.body.id_produto;
    const action = req.body.action;
    console.log(id_usuario, id_produto, action);

    //Faz a edição da quantidade do produto
    try {
      const userCarrinho = await Carrinho.findOne({
        where: { id_usuario },
        raw: true,
      });

      const item_carrinho = await Item_carrinho.findOne({
        where: { id_carrinho: userCarrinho.id_carrinho, id_produto },
        raw: true,
      });

      console.log(item_carrinho);

      if (action === "add") {
        //Aumenta em 1 a quantidade do items do carrinho
        item_carrinho.quantidade = item_carrinho.quantidade + 1;

        const resultado = Item_carrinho.update(item_carrinho, {
          where: { id_carrinho: userCarrinho.id_carrinho, id_produto },
        });

        console.log(resultado);
        return res.status(200).send();
      } 
      else if (action === "subtract") {
        //Guard Clause
        if(item_carrinho.quantidade === 1) return res.status(400).json({ error: "Imposível subtrair mais" });
       
        //subtrai em 1 a quantidade do items do carrinho
        item_carrinho.quantidade = item_carrinho.quantidade - 1;

        const resultado = Item_carrinho.update(item_carrinho, {
          where: { id_carrinho: userCarrinho.id_carrinho, id_produto },
        });
        
        return res.status(200).send();
      }
      else {
        return res.status(400).json({ error: "Ação não especificada" });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json(error);
    }
  },

  async removeUserCartProduct(req, res) {
    const {id_usuario, id_produto} = req.params;

    try {
      const userCarrinho = await Carrinho.findOne({
        where: { id_usuario },
        raw: true,
      });

      const item_carrinho = await Item_carrinho.findOne({
        where: { id_carrinho: userCarrinho.id_carrinho, id_produto },
        raw: true,
      });

      const resultado = await Item_carrinho.destroy({
        where: {
          id_carrinho: userCarrinho.id_carrinho,
          id_produto: item_carrinho.id_produto
        }
      })

      return res.status(204).send();
    } catch (error) {
      console.error(error);
    }


    res.status(200).send("Rota conectada");
  },

  async clearUserCart(req, res) {
    const id_usuario = req.params.id;

    try {
      const userCarrinho = await Carrinho.findOne({
        where: { id_usuario },
        raw: true,
      });

      const items_carrinho = await Item_carrinho.destroy({
        where: { id_carrinho: userCarrinho.id_carrinho },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(400).json({ error, msg: "Erro ao limpar o carrinho" });
    }
  },
};

module.exports = carrinho;
