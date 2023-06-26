module.exports = (sequelize, DataType) => {
  const Pedido = sequelize.define("Pedido", {
    id_pedido: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataType.INTEGER
    },
    valor_total: {
      type: DataType.DECIMAL
    },
    data: {
      type: DataType.DATE
    },
    status: {
      type: DataType.STRING(45),
      allowNull: true
    },
    id_endereco: {
      type: DataType.INTEGER
    },
  }, {
    tableName: "pedido",
    timestamps: false
  })

  Pedido.associate = (models) => {
    Pedido.hasMany(models.Item_pedido, {foreignKey: "id_pedido"});
    
    Pedido.hasMany(models.Usuario, {foreignKey: "id_usuario"});

    Pedido.belongsTo(models.Endereco, {foreignKey:"id_endereco"});

  }
  return Pedido;
}