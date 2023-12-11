const axios = require('axios');
const fs = require("node:fs/promises");
const path = require('path');
const { v4: uuidv4 } = require('uuid');


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

  async sendDatasForBlip(nome, telefone, email) {
    return new Promise(async (resolve, reject) => {
      try {

        let newGUID = await uuidv4();

        const dados = {
          id: `${newGUID}`,
          to: "postmaster@crm.msging.net",
          method: "set",
          uri: "/contacts",
          type: "application/vnd.lime.contact+json",
          resource: {
            identity: `${telefone.replace(/[^\d]/g, '')}@wa.gw.msging.net`,
            name: nome,
            phoneNumber: telefone.replace(/[^\d]/g, ''),
            email: email,
            extras: {
              rdstation: true
            }
          }
        }

        await this.logsService(JSON.stringify(dados))


        const url = 'https://augustusclinique.http.msging.net/commands';
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Key YXVndXN0dXNjbGluaXF1ZTpsM2FqNDZydTdPanlTMGtnSGhXYw==`,
          },
        };
        const resposta = await axios.post(url, dados, config);

        await this.logsService("\n" + JSON.stringify(resposta.data))

        resolve();
      } catch (erro) {
        console.error('Erro na requisição para a API:', erro.response);
        throw erro;
      }
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

