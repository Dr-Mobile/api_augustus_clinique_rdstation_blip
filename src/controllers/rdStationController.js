const rdStationService = require("../services/rdStationService");

class RdController {
  async post(req, res) {

    console.log("Requisição " + JSON.stringify(req.body))

    // if (await rdStationService.dataVerify(req.body)) {
    //   const { nome, telefone, email } = req.body;

    //   rdStationService.sendDatasForBlip(nome, telefone, email);
    // }
    res.send();
  }

}

module.exports = new RdController();
