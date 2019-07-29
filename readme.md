This readme is a work in progress. 

Meta transaction enabled Chat App: 

Requirements: 

Docker
ZOS  (ZeppelinOS)
Truffle
Ganache-cli

Process: (This will be improved later with a tutorial)

Get it: 

`git clone git@github.com:crazyrabbitLTC/gsnTutorial-ChatApp-ZepKit.git`

`npm install`

`cd client`

`npm install`


New Terminal Window, top of project:

npx gsn-dock-relay-ganache

(This runs it's own ganache)
 
New terminal window: top of project: 

`oz create`

Select `ChatApp`

Network `development`

Select "yes" to run a function. Choose the init function. You need to enter the address of your relay hub here. You will find this at the deployment part of the docker instance. It should be: `0x9C57C0F1965D225951FE1B2618C92Eefd687654F`

Now you need to fund you dApp: 

`oz send-tx --value 100000000000000000`

Select `ChatApp`

Network `development`

Select `deposit()`

Your dapp should be funded and the relay running. 

In a new terminal window: 

cd client

npm run start

Follow along from your browser!!!!

(If you have a problem you might need to toggle networks or reset metamask)