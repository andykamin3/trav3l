import {ethers} from "ethers";
import Web3Modal from "web3modal";
import {providerOptions} from "./utils/ProviderOptions";

export const web3Modal = new Web3Modal({
  network: "80001",
  cacheProvider: true, // optional
  providerOptions // required
});

/*
  * Connect wallet with web3 modal
  * @param {Web3Modal} web3Modal
  * @returns {Object} {provider, library, accounts, network, signer}
 */
export const updateWallet = async web3Modal => {
  try {
    const provider = await web3Modal.connect();
    const library = new ethers.providers.Web3Provider(provider);
    const accounts = await library.listAccounts();
    const network = await library.getNetwork();
    const signer = library.getSigner();
    return {provider, library, accounts, network, signer};
  } catch (error) {
    console.log(error);
  }
};
