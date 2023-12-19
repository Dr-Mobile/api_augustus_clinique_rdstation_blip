const fs = require("node:fs/promises");
const path = require('path');
const { v4: uuidv4 } = require('uuid');
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
        const keyAuth = "Key YXVndXN0dXNjbGluaXF1ZTpsM2FqNDZydTdPanlTMGtnSGhXYw=="

        let resp = await sendRequest(url, keyAuth, dados);

        await this.logsService("\n" + JSON.stringify(resp.data))

        resolve();
      } catch (erro) {
        console.error('Erro na requisição para a API:', erro.response);
        throw erro;
      }
    })
  }

  async requestBlip(dados) {
    return new Promise(async (resolve, reject) => {

      let keyAuth = "Key YXVndXN0dXNjbGluaXF1ZTpsM2FqNDZydTdPanlTMGtnSGhXYw==";
      let url = "https://augustusclinique.http.msging.net/commands";

      let resp = await sendRequest(url, keyAuth, dados);

      await this.logsService("\n" + JSON.stringify(resp))

      resolve(resp);

    })
  }

  

  async sendMessage(nome, telefone, email) {
    return new Promise(async (resolve, reject) => {
      try {

        let newGUID = await uuidv4();

        const dados = {
          id: `${newGUID}`,
          to: `${telefone}@wa.gw.msging.net`,
          type: "application/json",
          content: {
            type: "template",
            template: {
              namespace: "8c1521d7_0996_47db_b74b_561c5132fa9f",
              name: "paciente_faltoso_motivos",
              language: {
                code: "pt_BR",
                policy: "deterministic"
              },
              components: [
                {
                  type: "body",
                  parameters: [
                    {
                      type: "text",
                      text: `${nome}`
                    },
                    {
                      type: "text",
                      text: "teste"
                    },
                    {
                      type: "text",
                      text: "teste, teste"
                    }
                  ]
                }
              ]
            }
          }
        }

        await this.logsService(JSON.stringify(dados))




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

