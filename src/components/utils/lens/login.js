import {apolloClient} from "../apollo-client";
import {gql} from "@apollo/client";
import {getAuthenticationToken, setAuthenticationToken} from "../auth-token/scratch";

const GET_CHALLENGE = `
  query($request: ChallengeRequest!) {
    challenge(request: $request) { text }
  }
`;
export const generateChallenge = (address) => {
  return apolloClient.query({
    query: gql(GET_CHALLENGE),
    variables: {
      request: {
        address,
      },
    },
  });
};
const AUTHENTICATION = `
  mutation($request: SignedAuthChallenge!) { 
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`;
const authenticate = (address, signature) => {
  return apolloClient.mutate({
    mutation: gql(AUTHENTICATION),
    variables: {
      request: {
        address,
        signature,
      },
    },
  });
};
export const login = async (signer, address) => {
  if (getAuthenticationToken() !== null && getAuthenticationToken() !== undefined) {
    return;
  }
  console.log(address);
  const challengeResponse = await generateChallenge(address);

  console.log(challengeResponse);

  const signature = await signer.signMessage(challengeResponse.data.challenge.text);
  const accessToken = await authenticate(address, signature);
  setAuthenticationToken(accessToken.data.authenticate.accessToken);
  return accessToken.data;
}
export const logout = () => {
  setAuthenticationToken(null);
}
