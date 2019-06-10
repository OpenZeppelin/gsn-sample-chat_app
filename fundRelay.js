const Web3 = require("web3");
const web3 = new Web3("ws://localhost:8545");


const app = async () => {

    try {
        const networkId = await web3.eth.net.getId();
        const accounts = await web3.eth.getAccounts();
        console.log("The Accounts: ", accounts);
      
        console.log(`Network ID: ${networkId}`);
        const chatAppArtifact = require("./build/contracts/ChatApp.json");
        const chatAppAddress = chatAppArtifact.networks[networkId].address;
        const chatAppInstance = new web3.eth.Contract(
          chatAppArtifact.abi,
          chatAppAddress
        );
      
        console.log(`ChatApp Address: ${chatAppAddress}`);
      
        const relayHubArtifact = require("./build/contracts/RelayHub.json");
        const relayHubAddress = "0x9C57C0F1965D225951FE1B2618C92Eefd687654F";
        const relayHubInstance = new web3.eth.Contract(
          relayHubArtifact.abi,
          relayHubAddress
        );
      
        console.log(`RelayHub Address: ${relayHubAddress}`);
        //console.log(relayHubInstance.methods);
      
        const txDeposit = await relayHubInstance.methods
          .depositFor(chatAppAddress)
          .send({ from: accounts[0], gas: 5000000, value: 1e18 });
        console.log(txDeposit);
      
        const txInit = await chatAppInstance.methods
          .init_hub(relayHubAddress)
          .send({ from: accounts[0], gas: 5000000 });
        console.log(txInit);
      
        console.log("READY!");
    } catch (error) {
        console.log(error);
    }

};

app();
