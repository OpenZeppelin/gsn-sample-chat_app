This sample project was not updated to GSN v2.

---

# GSN Chat ChatApp

(Gas Stations Network) Chat ChatApp
https://gsn-chat-app.openzeppelin.com

The GSN Chat App is an application designed to showcase the use of Meta Transaction powered smart contract backed applications. Unlike traditional Ethereum powered smart contract applications, when using Meta Transactions users are not required to have ETH or even have an Ethereum wallet to interact with smart contracts.

## Background:

To learn more about Meta Transactions and the Gas Stations Network:

[1–800-Ethereum: Gas Stations Network for Toll Free Transactions](https://medium.com/tabookey/1-800-ethereum-gas-stations-network-for-toll-free-transactions-4bbfc03a0a56)
[Ethereum Meta Transactions](https://medium.com/@austin_48503/ethereum-meta-transactions-90ccf0859e84)
[How Meta Transactions will Scale Ethereum](https://medium.com/hackernoon/how-meta-transactions-will-scale-ethereum-e98c848f7719)

# Get started

**Requirements:**

[Docker](https://docker.com)
[OpenZeppelin SDK](https://openzeppelin.com/sdk/)
[Truffle](https://www.trufflesuite.com/)

**Clone App**

First, clone the project to your machine.

`git clone https://github.com/OpenZeppelin/gsn-sample-chat_app.git`

`cd gsn-sample-chat_app`

`npm install`

`cd client`

`npm install`

**Run docker Relay instance**

In a new Terminal Window, top of project:

`npx gsn-dock-relay-ganache`

This runs the docker instance which runs it's own copy of [Ganache-cli](https://www.trufflesuite.com/ganache)

**Deploy ChatApp**

In a new terminal window, top of project:

`oz compile`

`oz create`

Select `ChatApp`

Network `development`

Select "yes" to run a function. Choose the `linkRelayHub()` function. You need to enter the address of your relay hub here. This tells your solidity contract where it should find the `RelayHub` you intend to use. You will find this at the deployment part of the docker instance.

It should be: `0xD216153c06E857cD7f72665E0aF1d7D82172F494`

**Fund your App on the RelayHub**

Now you need to fund you dApp:

`oz send-tx --value 1000000000000000000`

Select: `ChatApp`

Network: `development`

Select: `deposit()`

Your dapp should be funded and the relay running.

**Run the Client**

In a new terminal window:

`cd client`

`npm run start`

Your browser should open and take you to the App.
