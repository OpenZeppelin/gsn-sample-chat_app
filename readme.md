Meta transaction enabled Chat App: 

MetaTransactions are the soludion to the Ethereum onboarding problem. By allowing users to interact with contracts without having ETH means that users can start using your application right out of the box. 

To demo the power of MetaTransactions we have created this demo Chat Application, powered by the Gas Stations Network. 

This example shows an Ethereum powered Chat room, you are given the choice of using three different transaction flows- Normal Transaction signing in Metamask, MetaTransactions using MetaMask as a signer, and then finally, MetaTransactions using a in-browser generated keypair to sign messages to the Gas Stations Network Relay. 


Requirements: 

Docker
OpenZeppelin-SDK
Truffle
Ganache-cli

Process: (This will be improved later with a tutorial)

Get it: 

`git clone git@github.com:crazyrabbitLTC/gsnTutorial-ChatApp-ZepKit.git`

`npm install`

`cd client`

`npm install`

New Terminal Window, top of project:


`npx gsn-dock-relay-ganache`
 
New Terminal window, top of project: (To start fresh delete build folder, zos.<<network>>.json files)- if you delete zos.json you will need to do zos add ChatApp first. 

`oz create`

Follow the prompts to deloy "ChatApp"

Now fund the Relay, run the script in the Helper folder: 

`node fundRelay.js`

New Terminal Window: 

`cd client`

`npm run start`

You may need to refresh your MetaMask. 
