const rdStationService = require("../services/rdStationService");

class RdController {
  async post(req, res) {
    try {
      if (await rdStationService.dataVerify(req.body)) {
        let leads = req.body.leads;

        await leads.map(async lead => {
          const { name, personal_phone, email } = lead;
          // await rdStationService.sendDatasForBlip(name, personal_phone, email);

          let uuid = await uuidv4();

          let dados = {
            id: `${uuid}`,
            to: "postmaster@wa.gw.msging.net",
            method: "get",
            uri: `lime://wa.gw.msging.net/accounts/+${personal_phone.replace(/[^\d]/g, '')}`
          }

          let idWhatsApp = await rdStationService.requestBlip(dados);
          const { data: idData } = idWhatsApp;
          const { status: idStatus, resource } = idData;

          if (idStatus === 'success') {

            const { alternativeAccount: identity } = resource;

            const jsonUpdateContact = JSON.parse(`{
                            "id":"${uuid}",
                            "method":"merge",
                            "uri":"/contacts",
                            "type":"application/vnd.lime.contact+json",
                            "resource":{"identity":"${identity}",
                            "name":"${name}",
                            "phoneNumber": "${personal_phone.replace(/[^\d]/g, '')}",
                            "extras":{
                              "rdstation": "true"
                            },
                            "source": "WhatsApp"}}`);

            let update = await rdStationService.requestBlip(jsonUpdateContact);

            const { data: contactData } = update;
            const { status: contactStatus } = contactData;

            if (contactStatus === 'success') {

              const idBot = 'principalaugustusclinique';
              const jsonChangeBot = JSON.parse(`{
                                "id": "${uuid}",
                                "to": "postmaster@msging.net",
                                "method": "set",
                                "uri": "/contexts/${identity}/master-state",
                                "type": "text/plain",
                                "resource": "${idBot}@msging.net"}`);

              let chooseBot = await rdStationService.requestBlip(jsonChangeBot);

              const { data: chooseBotData } = chooseBot;
              const { status: chooseBotStatus } = chooseBotData;

              if (chooseBotStatus === 'success') {

                const stateId = 'welcome';
                const flowIdentifier = 'f0196988-2f4e-42ab-9733-4fdce21d37f1';
                const jsonChangeUserState = JSON.parse(`{
                                  "id": "${uuid}",
                                  "to":"postmaster@msging.net",
                                  "method": "set",
                                  "uri": "/contexts/${identity}/stateid@${flowIdentifier}",
                                  "type": "text/plain",
                                  "resource": "${stateId}"}`);

                let changeUserState = await rdStationService.requestBlip(jsonChangeBot);

                const { data: changeData } = changeUserState;
                const { status: changeStatus } = changeData;

                if (changeStatus === 'success') {

                  const namespace = "";
                  const modeloMensagem = "";
                  const jsonEnviaMensagemConsulta = JSON.parse(`{
                                        "id":"${uuid}",
                                        "to":"${identity}",
                                        "type":"application/json",
                                        "content":{
                                          "type":"template",
                                          "template":{
                                            "namespace":"${namespace}",
                                            "name":"${modeloMensagem}",
                                            "language":{
                                              "code":"pt_BR",
                                              "policy":"deterministic"
                                            },
                                            "components":[
                                              {
                                                "type": "body",
                                                "parameters":[
                                                  {
                                                    "type": "text",
                                                    "text": "${msg.data
                      .split('-')
                      .reverse()
                      .join('/')}"
                                                  },
                                                  {
                                                    "type": "text",
                                                    "text": "${msg.hora.split(':')[0]
                    }:${msg.hora.split(':')[1]}"
                                                  },
                                                  {
                                                    "type": "text",
                                                    "text": "${msg.unidade}"
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        }
                                      }`);

                  const enviaWhatsapp = await messages(
                    jsonEnviaMensagemConsulta,
                    tokenblip
                  );

                  const { status: statusEnvio } = enviaWhatsapp;

                  if (statusEnvio === 202) {
                    logger(`Mensagem enviada com sucesso para ${identity}`);

                    await new Promise(resolve =>
                      setTimeout(
                        resolve,
                        randomIntFromInterval(rndInt.min, rndInt.max)
                      )
                    );

                    const trackingDetailedBody = `{
                                      "id": "${uuid}",
                                      "to": "postmaster@analytics.msging.net",
                                      "method": "set",
                                      "type": "application/vnd.iris.eventTrack+json",
                                      "uri": "/event-track",
                                      "resource": {
                                        "category": "Confirmacao Detalhada",
                                        "action": "Sucesso - Contato: ${celular}"
                                      }
                                    }`;
                    await commands(trackingDetailedBody, tokenblip);

                    const trackingBody = `{
                                      "id": "${uuid}",
                                      "to": "postmaster@analytics.msging.net",
                                      "method": "set",
                                      "type": "application/vnd.iris.eventTrack+json",
                                      "uri": "/event-track",
                                      "resource": {
                                        "category": "Confirmacao",
                                        "action": "Sucesso"
                                      }
                                    }`;
                    await commands(trackingBody, tokenblip);

                    await new GerenciaMensagem({
                      id_hospital: msg.horarioId,
                      celular,
                      cnpj,
                      nome_modelo: modelo_mensagem,
                      variaveis: `${uuid},
                                              ${identity},
                                              ${namespace},
                                              ${idbot},
                                              ${msg.paciente}`,
                      enviado: 'SIM',
                      uuid,
                    }).save();
                  }
                }
              }
            }
          } else {
            await new Promise(resolve =>
              setTimeout(resolve, randomIntFromInterval(rndInt.min, rndInt.max))
            );

            const trackingDetailedBody = `{
                "id": "${uuid}",
                "to": "postmaster@analytics.msging.net",
                "method": "set",
                "type": "application/vnd.iris.eventTrack+json",
                "uri": "/event-track",
                "resource": {
                  "category": "Confirmacao Detalhada",
                  "action": "Falha - Motivo: Sem WhatsApp, Contato: ${celular}"
                }
              }`;
            await commands(trackingDetailedBody, tokenblip);

            const trackingBody = `{
                "id": "${uuid}",
                "to": "postmaster@analytics.msging.net",
                "method": "set",
                "type": "application/vnd.iris.eventTrack+json",
                "uri": "/event-track",
                "resource": {
                  "category": "Confirmacao",
                  "action": "Falha"
                }
              }`;
            await commands(trackingBody, tokenblip);

            await new GerenciaMensagem({
              id_hospital: msg.horarioId,
              celular,
              cnpj,
              nome_modelo: modelo_mensagem,
              enviado: 'NAO',
              ds_erro: 'SEM WHATSAPP',
              uuid,
            }).save();
          }


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
