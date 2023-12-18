
module.exports.sendRequest = async function sendRequest(url, auth, dados) {
    return new Promise(async (resolve, reject) =>{
        try{
            const config = {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `${auth}`,
                },
              };
              const resposta = await axios.post(url, dados, config);
      
              resolve(resposta);
        } catch(e) {
            console.log("Erro " + e);
            resolve();
        }
    })
}

