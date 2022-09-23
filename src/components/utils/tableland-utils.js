import { connect } from "@tableland/sdk";
const TABLE_ID = "trav_three_l_test_80001_2757";

let tableland;
const connectToTableLand = async () => {
  tableland = await connect({network: "testnet", chain: "polygon-mumbai"});
  await tableland.siwe();
  console.log(tableland);
}


export const defineTable = async () => {
  await connectToTableLand();
  const table = await tableland.create(
    `id INTEGER PRIMARY KEY, name TEXT, description TEXT, lng REAL, lat REAL, image TEXT, startDate TEXT, endDate TEXT, profileId TEXT, address TEXT, placeName TEXT, url TEXT`,
    {
      prefix:"trav_three_l_test"
    }
  );  // MAIN TABLE DATA SCHEMA

  console.log(table);
}

export const addEventToTable = async (event) => {
  try {
    await connectToTableLand();
    let query = `INSERT INTO ${TABLE_ID} (name, description, lng, lat, image, startDate, endDate, profileId, address, name,url)
                                            VALUES ('${event.name}' , '${event.description}' , ${event.lng} , ${event.lat} , '${event.image}' , '${event.startDate}' , '${event.endDate}' , '${event.ownedBy}' , '${event.address}' , '${event.placeName}', '${event.url}')`;
    console.log(query);
    const writeRes =  tableland.write(query);
    console.log(writeRes)
    console.log(await writeRes)
    return await writeRes;
  } catch (e){
    console.log(e)
    return null;
  }

}


export const getEvents = async () => {
  try {
    tableland = await connect({network: "testnet", chain: "polygon-mumbai"});
    const query = `SELECT * FROM ${TABLE_ID}`;
    const readRes = await tableland.read(query);
    console.log(readRes)
    return readRes;
  } catch (e){
    console.log(e)
    return null;
  }
}
