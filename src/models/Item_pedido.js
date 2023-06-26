module.exports = (sequelize, DataType) => {
  
  const Item_pedido = sequelize.define("Item_pedido", {
    id_pedido: {
      type: DataType.INTEGER,
      primaryKey: true,
    },
    id_produto: {
      type: DataType.INTEGER,
      primaryKey: true,
    },
    quantidade: {
      type: DataType.INTEGER,
    },
  }, {
    tableName: "item_pedido",
    timestamps: false
  })

  Item_pedido.associate = (models) => {
    Item_pedido.belongsTo(models.Pedido, {foreignKey: "id_pedido"});
    Item_pedido.belongsTo(models.Produto, {foreignKey: "id_produto"});

  
  }
  return Item_pedido;
}