const { v4: uuidv4 } = require('uuid');
const rdStationService = require("../services/rdStationService");


class RdController {
  async post(req, res) {
    try {
      if (await rdStationService.dataVerify(req.body)) {
        let leads = req.body.leads;

        await leads.map(async lead => {
          try {
            const { name, personal_phone, email } = lead;

            let uuid = await uuidv4();

            let dados = {
              id: `${uuid}`,
              to: "postmaster@wa.gw.msging.net",
              method: "get",
              uri: `lime://wa.gw.msging.net/accounts/+${personal_phone.replace(/[^\d]/g, '')}`
            }

            let idWhatsApp = await rdStationService.requestBlip(dados, "commands");

            const { data: idData } = idWhatsApp;
            const { status: idStatus, resource } = idData;

            if (idStatus === 'success') {

              const { alternativeAccount: identity } = resource;

              const jsonUpdateContact = {
                id: `${uuid}`,
                method: "merge",
                uri: "/contacts",
                type: "application/vnd.lime.contact+json",
                resource: {
                  identity: `${identity}`,
                  name: `${name}`,
                  email: `${email}`,
                  phoneNumber: `${personal_phone.replace(/[^\d]/g, '')}`,
                  extras: {
                    rdstation: "true"
                  },
                  source: "WhatsApp"
                }
              };

              let update = await rdStationService.requestBlip(jsonUpdateContact, "commands");

              const { data: contactData } = update;
              const { status: contactStatus } = contactData;

              if (contactStatus === 'success') {

                const idBot = 'principalaugustusclinique';
                const jsonChangeBot = {
                  id: `${uuid}`,
                  to: "postmaster@msging.net",
                  method: "set",
                  uri: `/contexts/${identity}/master-state`,
                  type: "text/plain",
                  resource: `${idBot}@msging.net`
                };

                let chooseBot = await rdStationService.requestBlip(jsonChangeBot, "commands");
                console.log(chooseBot)

                const { data: chooseBotData } = chooseBot;
                const { status: chooseBotStatus } = chooseBotData;

                if (chooseBotStatus === 'success') {

                  const stateId = '55593bb2-afde-45b5-9343-70c4947babf4';
                  const flowIdentifier = 'f0196988-2f4e-42ab-9733-4fdce21d37f1';

                  const jsonChangeUserState = {
                    id: `${uuid}`,
                    to: "postmaster@msging.net",
                    method: "set",
                    uri: `/contexts/${identity}/stateid@${flowIdentifier}`,
                    type: "text/plain",
                    resource: `${stateId}`
                  };



                  let changeUserState = await rdStationService.requestBlip(jsonChangeUserState, "commands");

                  const { data: changeData } = changeUserState;
                  const { status: changeStatus } = changeData;

                  if (changeStatus === 'success') {

                    const namespace = "bc249673_201a_481c_b91f_889006afbc48";
                    const modeloMensagem = "mensagem_forms_rd_copia";
                    const jsonEnviaMensagemConsulta = {
                      id: `${uuid}`,
                      to: `${identity}`,
                      type: "application/json",
                      content: {
                        type: "template",
                        template: {
                          namespace: `${namespace}`,
                          name: `${modeloMensagem}`,
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
                                  text: `${name}`
                                }
                              ]
                            }
                          ]
                        }
                      }
                    };

                    let enviaWhatsapp = await rdStationService.requestBlip(jsonEnviaMensagemConsulta, "messages");

                    const { status: statusEnvio } = enviaWhatsapp;

                    console.log("STATUS DO ENVIO " + statusEnvio);

                    if (statusEnvio === 202) {

                      const trackingDetailedBody = {
                        id: `${uuid}`,
                        to: "postmaster@analytics.msging.net",
                        method: "set",
                        type: "application/vnd.iris.eventTrack+json",
                        uri: "/event-track",
                        resource: {
                          category: "Confirmacao Detalhada",
                          action: `Sucesso - Contato: ${personal_phone.replace(/[^\d]/g, '')}`
                        }
                      };

                      await rdStationService.requestBlip(trackingDetailedBody);

                      const trackingBody = {
                        id: `${uuid}`,
                        to: "postmaster@analytics.msging.net",
                        method: "set",
                        type: "application/vnd.iris.eventTrack+json",
                        uri: "/event-track",
                        resource: {
                          category: "Confirmacao",
                          action: "Sucesso"
                        }
                      };

                      await rdStationService.requestBlip(trackingBody);
                    }
                  }
                }
              }
            } else {
              console.log("Deu zica");

              const trackingDetailedBody = {
                id: `${uuid}`,
                to: "postmaster@analytics.msging.net",
                method: "set",
                type: "application/vnd.iris.eventTrack+json",
                uri: "/event-track",
                resource: {
                  category: "Confirmacao Detalhada",
                  action: `Falha - Motivo: Sem WhatsApp, Contato: ${personal_phone.replace(/[^\d]/g, '')}`
                }
              };
              await rdStationService.requestBlip(trackingDetailedBody);

              const trackingBody = {
                id: `${uuid}`,
                to: "postmaster@analytics.msging.net",
                method: "set",
                type: "application/vnd.iris.eventTrack+json",
                uri: "/event-track",
                resource: {
                  category: "Confirmacao",
                  action: "Falha"
                }
              };
              await rdStationService.requestBlip(trackingBody);
            }
          } catch (e) {
            await rdStationService.logsService("\n" + e);
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
