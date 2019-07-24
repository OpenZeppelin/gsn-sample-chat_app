import Web3 from "web3";
const FALLBACK_WEB3_PROVIDER =
  process.env.REACT_APP_NETWORK || "http://0.0.0.0:8545";
const tabookey = require("tabookey-gasless");
const cookies = require("browser-cookies");

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

const getGanacheWeb3 = () => {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    return null;
  }
  const provider = new Web3.providers.HttpProvider("http://0.0.0.0:8545");
  const web3 = new Web3(provider);
  return web3;
};

//From @github Kyrrui
const useRelayer = web3 => {
  const RelayProvider = tabookey.RelayProvider;
  var provider = new RelayProvider(web3.currentProvider, {
    txfee: 12,
    // verbose:true,
    force_gasLimit: 500000
  });
  web3.setProvider(provider);
  console.log("USING Normal RELAYER");
};

const useInjectedWeb3 = web3 => {
  web3.setProvider(window.ethereum);
  console.log("USING Injected Web3");
};

// const useEphermeralRelay = web3 => {
//   const RelayClient = tabookey.RelayClient;
//   var provider = new RelayClient(web3, {
//     txfee: 12,
//     force_gasLimit: 500000
//   });
//   web3.setProvider(provider);
//   console.log("USING Emphermeral RELAYER");

//   console.log("The provider: ", provider);
//   let keypair = RelayClient.newEphemeralKeypair();
//   provider.useKeypairForSigning(keypair);
//   let account = keypair.address;
//   return account;
// };

const useEphermeralRelay = web3 => {
  let rc = new tabookey.RelayClient(web3);
  let ephemeralKeypair = tabookey.RelayClient.newEphemeralKeypair();
  rc.useKeypairForSigning(ephemeralKeypair)
  console.log("Keypaid: ", rc);
  web3.setProvider(rc);
  return ephemeralKeypair.address;
}

export default getWeb3;
export { getGanacheWeb3, useRelayer, useEphermeralRelay, useInjectedWeb3 };
