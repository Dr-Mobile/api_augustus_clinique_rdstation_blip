const fs = require("node:fs/promises");
const path = require('path');
const { sendRequest } = require('../../help');


class RdService {
  async dataVerify(dados) {
    return new Promise(async (resolve, reject) => {
      try {
        if (dados.leads && dados.leads.length > 0) {
          resolve(true);
        }
        resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  
  async requestBlip(dados, type) {
    return new Promise(async (resolve, reject) => {

      let keyAuth = "Key YXVndXN0dXNjbGluaXF1ZTpsM2FqNDZydTdPanlTMGtnSGhXYw==";
      let url = `https://augustusclinique.http.msging.net/${type}`;

      let resp = await sendRequest(url, keyAuth, dados);

      await this.logsService("\n" + resp)

      resolve(resp);

    })
  }

  async logsService(data) {
    return new Promise(async (resolve, reject) => {
      try {

        const logFilePath = path.join(__dirname, '..', '..', "logs.txt");
        let logs = (await fs.readFile(logFilePath)).toString();

        logs += "\n" + data;

        await fs.writeFile(logFilePath, logs);

        resolve(logs.toString())

      } catch (e) {
        console.log(e);
        resolve();
      }
    })
  }

}

module.exports = new RdService();

