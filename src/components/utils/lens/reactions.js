import {apolloClient} from "../apollo-client";
import {gql} from "@apollo/client";

const ADD_REACTION = `
  mutation($request: ReactionRequest!) { 
   addReaction(request: $request)
 }
`;

export const addReactionRequest = (profileId, reaction, publicationId) => {
  console.log({profileId, reaction, publicationId});
  return apolloClient.mutate({
    mutation: gql(ADD_REACTION),
    variables: {
      request: {
        profileId,
        reaction,
        publicationId,
      },
    },
  });
};
