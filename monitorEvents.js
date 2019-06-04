const Web3 = require("web3");
const web3 = new Web3("ws://localhost:8545");

const app = async () => {
  try {
    const networkId = await web3.eth.net.getId();

    console.log("The Network ID is: ", networkId);

    const tokenInterface = require("./build/contracts/ChatApp.json");

    //console.log("Token interface: ", tokenInterface );
    const deployedAddress = tokenInterface.networks[networkId].address;
    token = new web3.eth.Contract(tokenInterface.abi, deployedAddress);

    // a list for saving subscribed event instances
    const subscribedEvents = {};
    // Subscriber method
    const subscribeLogEvent = (contract, eventName) => {
      const eventJsonInterface = web3.utils._.find(
        contract._jsonInterface,
        o => o.name === eventName && o.type === "event"
      );
      const subscription = web3.eth.subscribe(
        "logs",
        {
          address: contract.options.address,
          topics: [eventJsonInterface.signature]
        },
        (error, result) => {
          if (!error) {
            const eventObj = web3.eth.abi.decodeLog(
              eventJsonInterface.inputs,
              result.data,
              result.topics.slice(1)
            );
            console.log(`New ${eventName}!`, eventObj);
          }
        }
      );
      subscribedEvents[eventName] = subscription;
    };

    console.log("Watching events");
    subscribeLogEvent(token, "message");
  } catch (error) {
    console.log(error);
  }
};

app();
