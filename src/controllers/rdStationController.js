const rdStationService = require("../services/rdStationService");

class RdController {
  async post(req, res) {
    try {
      if (await rdStationService.dataVerify(req.body)) {
        let leads = req.body.leads;

        await leads.map(async lead => {
          const { name, personal_phone, email } = lead;
          await rdStationService.sendDatasForBlip(name, personal_phone, email);
        })        
      }
      res.send();
    } catch (e) {
      await rdStationService.logsService(e.message.toString())
      res.send();
    }
  }

}

module.exports = new RdController();
