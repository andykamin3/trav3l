import { NFTStorage } from 'nft.storage/dist/bundle.esm.min.js'
import { v4 as uuidv4 } from 'uuid';
const key = process.env.REACT_APP_NFT_STORAGE_KEY;

export const uploadImage = async (file) => {
  const client = new NFTStorage({ token: key });
  const cid = await client.storeBlob(file);
  console.log(cid)
  return cid;
}

export const storeMetadata = async (metadata, mediaObject, signer) => {
  const imageCid = await uploadImage(mediaObject);
  const ipfs_url = `https://ipfs.io/ipfs/${imageCid}`;
  // We use custom NFT metadata schema to be able to upload to Lens.
  const nft = {
    name: metadata.title,
    locale: "en-US",
    description: metadata.description,
    media: [{item:ipfs_url, alt:"TODO"}],
    image: ipfs_url,
    tags:["travel"],
    mainContentFocus:"IMAGE",
    external_url: ipfs_url, //TODO: Add more content metadata and info.
    attributes: [
      {
        displayType: "number",
        traitType: "lng",
        value: metadata.lng,
      },
      {
        displayType: "number",
        traitType: "lat",
        value: metadata.lat,
      }
    ],
    appId: "trav3l",
    metadata_id: uuidv4(),
    version: "2.0.0"
  }
  console.log(nft);
  const blob = new Blob([JSON.stringify(nft)], { type: 'application/json' });
  const client = new NFTStorage({ token: key });
  const metadataCid = await client.storeBlob(blob);
  console.log(metadataCid);
  return metadataCid;

}




/*
export interface PublicationMetadataMedia {
  item: Url;
  /**
   * This is the mime type of media
   */
//type?: MimeType | null;

/**
 * The alt tags for accessibility
 */
//altTag?: string | null;

/**
 * The cover for any video or audio you attached
 */
//cover?: string | null;
//}
/*
import { NFTStorage } from 'nft.storage'

// read the API key from an environment variable. You'll need to set this before running the example!
const API_KEY = process.env.NFT_STORAGE_API_KEY

// For example's sake, we'll fetch an image from an HTTP URL.
// In most cases, you'll want to use files provided by a user instead.
async function getExampleImage() {
  const imageOriginUrl = "https://user-images.githubusercontent.com/87873179/144324736-3f09a98e-f5aa-4199-a874-13583bf31951.jpg"
  const r = await fetch(imageOriginUrl)
  if (!r.ok) {
    throw new Error(`error fetching image: [${r.statusCode}]: ${r.status}`)
  }
  return r.blob()
}

async function storeExampleNFT() {
  const image = await getExampleImage()
  const nft = {
    image, // use image Blob as `image` field
    name: "Storing the World's Most Valuable Virtual Assets with NFT.Storage",
    description: "The metaverse is here. Where is it all being stored?",
    properties: {
      type: "blog-post",
      origins: {
        http: "https://nft.storage/blog/post/2021-11-30-hello-world-nft-storage/",
        ipfs: "ipfs://bafybeieh4gpvatp32iqaacs6xqxqitla4drrkyyzq6dshqqsilkk3fqmti/blog/post/2021-11-30-hello-world-nft-storage/"
      },
      authors: [{ name: "David Choi" }],
      content: {
        "text/markdown": "The last year has witnessed the explosion of NFTs onto the world’s mainstage. From fine art to collectibles to music and media, NFTs are quickly demonstrating just how quickly grassroots Web3 communities can grow, and perhaps how much closer we are to mass adoption than we may have previously thought. <... remaining content omitted ...>"
      }
    }
  }

  const client = new NFTStorage({ token: API_KEY })
  const metadata = await client.store(nft)

  console.log('NFT data stored!')
  console.log('Metadata URI: ', metadata.url)
}

storeExampleNFT()
 */
