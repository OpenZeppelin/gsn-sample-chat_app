userTokenBalance = async () => {
    const { accounts, contract, web3 } = this.props;
    let userBalance = await contract.methods.balanceOf(accounts[0]).call();
    let totalSupply = await contract.methods.totalSupply().call();
    const filterTo = { to: accounts[0] };
    const filterFrom = { from: accounts[0] };
    const lastCheckedBlock = await web3.eth.getBlockNumber();
    let userTokens;
    let userTokenURIs = {};

    //Get the list of tokens sent to this address
    const countTransfersToAddress = await contract.getPastEvents("Transfer", {
      filter: filterTo,
      fromBlock: 0,
      toBlock: "latest"
    });

    //Get the list of tokens this address sent away
    const countTransfersFromAddress = await contract.getPastEvents("Transfer", {
      filter: filterFrom,
      fromBlock: 0,
      toBlock: "latest"
    });

    //Function to Calculate the Total Users Balance
    const getTokenBalance = (to, from) => {
      let obj = {};
      to.forEach(el => {
        if (obj[el.returnValues.tokenId]) {
          obj[el.returnValues.tokenId] += 1;
        } else {
          obj[el.returnValues.tokenId] = 1;
        }
      });

      from.forEach(el => {
        if (obj[el.returnValues.tokenId]) {
          obj[el.returnValues.tokenId] -= 1;
        }
      });

      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] === 0) {
            delete obj[key];
          }
        }
      }

      return Object.keys(obj);
    };

    //Get Users token balance
    userTokens = getTokenBalance(
      countTransfersToAddress,
      countTransfersFromAddress
    );

    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    };

    const asyncTokenURILoad = async tokenArray => {
      let userTokenURIs = {};
      await asyncForEach(tokenArray, async token => {
        let tokenId = Number(token);
        userTokenURIs[tokenId] = await getTokenURI(tokenId);
      });
      return userTokenURIs;
    };

    const getTokenURI = async tokenId => {
      let uri = await contract.methods.tokenURI(tokenId).call();
      uri = JSON.parse(uri);
      return uri;
    };

    userTokenURIs = await asyncTokenURILoad(userTokens);

    this.setState({
      ...this.state,
      totalSupply,
      userBalance,
      userTokens,
      lastCheckedBlock,
      userTokenURIs
    });
  };