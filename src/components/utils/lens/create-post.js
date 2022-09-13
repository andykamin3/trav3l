import {login} from "./login";
import {getAuthenticationToken} from "../auth-token/scratch";

const createPost = async (signer, post, file) => {
  //Authenticate signer
  const address = signer.getAddress();
  const accessToken = getAuthenticationToken();
  if (accessToken === null || accessToken === undefined) {
    await login(signer, address);
  }
  //file is image
  if(true){

  } else {
    //Use Livepeer for video content.
  }
  //Create post


};
