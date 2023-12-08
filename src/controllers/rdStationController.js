const rdStationService = require("../services/rdStationService");

class RdController {
  async post(req, res) {

    console.log("Requisição " + req.body)
    console.log("Requisição total" + req)

    // if (await rdStationService.dataVerify(req.body)) {
    //   const { nome, telefone, email } = req.body;

    //   rdStationService.sendDatasForBlip(nome, telefone, email);
    // }
    res.send();
  }

}

module.exports = new RdController();
