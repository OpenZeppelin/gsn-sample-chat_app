import Web3 from "web3";
const FALLBACK_WEB3_PROVIDER =
  process.env.REACT_APP_NETWORK || "http://0.0.0.0:8545";
const tabookey = require("tabookey-gasless");
const INFURA_ID = 'd6760e62b67f4937ba1ea2691046f06d';

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          FALLBACK_WEB3_PROVIDER
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Infura/Local web3.");
        resolve(web3);
      }
    });
  });

const getInfuraWeb3 = () =>
  new Promise((resolve, reject) => {
      try {
        const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/" + INFURA_ID);
        const web3 = new Web3(provider);
        resolve(web3);
      } catch (error) {
        reject(error)
      }
      }
  );

const getGanacheWeb3 = () => {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    return null;
  }
  const provider = new Web3.providers.HttpProvider("http://0.0.0.0:8545");
  const web3 = new Web3(provider);
  return web3;
};

const useRelayer = async web3 => {
  const gasPricePercent = 20;

  let gasPrice =
    (process.env.REACT_APP_GAS_PRICE &&
      parseInt(process.env.REACT_APP_GAS_PRICE)) ||
    ((await web3.eth.getGasPrice()) * (100 + gasPricePercent)) / 10;
  let relay_client_config = {
    txfee: process.env.REACT_APP_TX_FEE || 12,
    force_gasPrice: gasPrice, //override requested gas price
    gasPrice: gasPrice, //override requested gas price
    force_gasLimit: 500000, //override requested gas limit.
    gasLimit: 500000, //override requested gas limit.
    verbose: true
  };

  const RelayProvider = tabookey.RelayProvider;
  var provider = new RelayProvider(web3.currentProvider, relay_client_config);
  web3.setProvider(provider);
  console.log("USING GSN RELAYER");
};

const useInjectedWeb3 = web3 => {
  web3.setProvider(window.ethereum);
  console.log("USING Injected Web3");
};

const useEphermeralRelay = web3 => {
  useRelayer(web3);
  const ephemeralKeypair = tabookey.RelayClient.newEphemeralKeypair();
  web3.currentProvider.relayClient.useKeypairForSigning(ephemeralKeypair);
  return ephemeralKeypair.address;
};

const getRelayBalance = async (web3, appAddress, relayInstance) => {
  let balance;

  try {
    balance = await relayInstance.methods.balanceOf(appAddress).call();
    balance = web3.utils.fromWei(balance, "ether");
  } catch (e) {
    console.log(e);
  }

  return balance;
};

const getDappBalance = async (web3, dappInstance) => {
  let balance;
  try {
    balance = await dappInstance.methods.getRecipientBalance().call();
    balance = web3.utils.fromWei(balance, "ether");
  } catch (error) {
    console.log(error);
  }
  return balance;
};

export default getWeb3;
export {
  getDappBalance,
  getRelayBalance,
  getGanacheWeb3,
  useRelayer,
  useEphermeralRelay,
  useInjectedWeb3,
  getInfuraWeb3
};
