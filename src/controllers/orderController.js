const {
  Pedido,
  Item_pedido,
  Endereco,
  Usuario,
  Produto,
} = require("../models");

const orderController = {
  async getAllOrders(req, res) {
    console.log("ativou a rota");
    try {
      //Pega os dados do pedido e o endereço
      const orders = await Pedido.findAll({
        attributes: [
          "id_pedido",
          "id_usuario",
          "valor_total",
          "data",
          "status",
          "id_endereco",
          "Endereco.id_usuario",
          "Endereco.cep",
          "Endereco.rua",
          "Endereco.numero",
          "Endereco.bairro",
          "Endereco.cidade",
          "Endereco.estado",
          "Endereco.complemento",
        ],
        include: [
          {
            model: Endereco,
            attributes: []
          },
        ],
        raw: true,
      });

      for (let order of orders) {
        const orderProducts = await Item_pedido.findAll({
          where: {
            id_pedido: order.id_pedido,
          },
          include: [
            {
              model: Produto,
            },
          ],
        });
        order.products = orderProducts;
        order.teste = "batata";
        console.log(order);
      }

      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = orderController;
