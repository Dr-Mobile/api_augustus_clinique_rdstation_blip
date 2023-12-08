const axios = require('axios');

class RdService {
  async dataVerify(dados) {
    return new Promise(async (resolve, reject) => {
      if (dados.name && dados.name !== "" &&
        dados.telefone && dados.telefone !== "" &&
        dados.email && dados.email !== "") {
        return true;
      }
      return false;
    });
  }

  async sendDatasForBlip(nome, telefone, email) {
    return new Promise(async (resolve, reject) => {
      try {
        const dados = {
          id: "{{$guid}}",
          to: "postmaster@crm.msging.net",
          method: "set",
          uri: "/contacts",
          type: "application/vnd.lime.contact+json",
          resource: {
            identity: "{{contact_identity}}",
            name: nome,
            phoneNumber: telefone,
            email: email,
            extras: { 
              rdstation: true
            }
          }
        }
        const url = 'URL_DA_API';
        const config = {
          headers: {
            'Content-Type': 'application/json',
            // Adicione o cabeçalho de autorização se estiver usando autenticação por token
            'Authorization': `token`,
          },
        };
        const resposta = await axios.post(url, dados, config);

        console.log('Resposta da API:', resposta.data);

        return resposta.data;
      } catch (erro) {
        console.error('Erro na requisição para a API:', erro.response.data);
        throw erro;
      }

    })
  }

}

module.exports = new RdService();


// // Função para enviar dados para a API via POST
// async function enviarDadosParaAPI(dados) {
// }

// // Exemplo de uso:
// const dadosParaEnviar = {
//   chave1: 'valor1',
//   chave2: 'valor2',
//   // ... adicione mais dados conforme necessário
// };

// enviarDadosParaAPI(dadosParaEnviar)
//   .then(resultado => {
//     // Faça algo com o resultado, se necessário
//     console.log('Operação bem-sucedida:', resultado);
//   })
//   .catch(erro => {
//     // Lide com erros, se necessário
//     console.error('Erro na operação:', erro);
//   });
