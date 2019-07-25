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
