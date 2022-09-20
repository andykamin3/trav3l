import {apolloClient} from "./apollo-client";
import {gql} from "@apollo/client";
import {BigNumber, ethers, utils} from "ethers";
import LENS_ABI from './lens-hub-contract-abi.json';
import {getProfiles} from "./lens/get-user";
import {login} from "./lens/login";
import {omit, pollUntilIndexed, splitSignature} from "./LensUtils";
const CREATE_POST_TYPED_DATA = `
  mutation($request: CreatePublicPostRequest!) { 
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
      }
    }
  }
}
`;

const createPostTypedData = (createPostTypedDataRequest) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_POST_TYPED_DATA),
    variables: {
      request: createPostTypedDataRequest,
    },
  });
};


export const createPost = async (signer, metadataURI) => {
  const lensHub = new ethers.Contract(process.env.REACT_APP_LENS_HUB_CONTRACT, LENS_ABI , signer);
  const address = await signer.getAddress()
  const profiles = await getProfiles(address);
  console.log(profiles.profiles.items[0]);
  const profileId = profiles.profiles.items[0].id;
  console.log(profileId);
  if (!profileId) {
    throw new Error('Must define PROFILE_ID in the .env to run this');
  }

  console.log('create post: address', address);

  await login(address);

  const ipfsResult ='ipfs://' + metadataURI

  // hard coded to make the code example clear
  const createPostRequest = {
    profileId,
    contentURI: ipfsResult,
    collectModule: {
      // feeCollectModule: {
      //   amount: {
      //     currency: currencies.enabledModuleCurrencies.map(
      //       (c: any) => c.address
      //     )[0],
      //     value: '0.000001',
      //   },
      //   recipient: address,
      //   referralFee: 10.5,
      // },
      // revertCollectModule: true,
      freeCollectModule: { followerOnly: false },
      // limitedFeeCollectModule: {
      //   amount: {
      //     currency: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      //     value: '2',
      //   },
      //   collectLimit: '20000',
      //   recipient: '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
      //   referralFee: 0,
      // },
    },
    referenceModule: {
      followerOnlyReferenceModule: false,
    },
  };

  const result = await createPostTypedData(createPostRequest);
  console.log('create post: createPostTypedData', result);

  const typedData = result.data.createPostTypedData.typedData;
  console.log('create post: typedData', typedData);

  const signature = await signer._signTypedData(
    omit(typedData.domain, '__typename'),
    omit(typedData.types, '__typename'),
    omit(typedData.value, '__typename')
  );
  console.log('create post: signature', signature);

  const { v, r, s } = splitSignature(signature);

  const tx = await lensHub.postWithSig({
    profileId: typedData.value.profileId,
    contentURI: typedData.value.contentURI,
    collectModule: typedData.value.collectModule,
    collectModuleInitData: typedData.value.collectModuleInitData,
    referenceModule: typedData.value.referenceModule,
    referenceModuleInitData: typedData.value.referenceModuleInitData,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });
  console.log('create post: tx hash', tx.hash);

  console.log('create post: poll until indexed');

  const indexedResult = await pollUntilIndexed(tx.hash);

  console.log('create post: profile has been indexed', result);

  const logs = indexedResult.txReceipt.logs;

  console.log('create post: logs', logs);

  const topicId = utils.id(
    'PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)'
  );
  console.log('topicid we care about', topicId);

  const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);
  console.log('create post: created log', profileCreatedLog);

  let profileCreatedEventLog = profileCreatedLog.topics;
  console.log('create post: created event logs', profileCreatedEventLog);

  const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0];

  console.log('create post: contract publication id', BigNumber.from(publicationId).toHexString());
  console.log(
    'create post: internal publication id',
    profileId + '-' + BigNumber.from(publicationId).toHexString()
  );




  return true;
};
