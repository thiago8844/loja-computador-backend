
const monteSeuPcController = {

  sendProductByDep(req, res) {
    const departamento = req.params.dep.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/g, '');
    const produtosDep = productsData.filter((prod) => prod["sub-departamento"] === departamento);

    res.json(produtosDep);
  }
}

module.exports = monteSeuPcController;