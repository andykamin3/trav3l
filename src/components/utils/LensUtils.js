import omitDeep from 'omit-deep';
import { Logger } from "@ethersproject/logger";
import {apolloClient} from "./apollo-client";
import {gql} from "@apollo/client";
export const version = "bytes/5.5.0";
const logger = new Logger(version);

const HexCharacters = "0123456789abcdef";

export const omit = (object, name) => {
  return omitDeep(object, name);
};

function isInteger(value) {
  return (typeof(value) === "number" && value === value && (value % 1) === 0);
}

export function isBytes(value) {
  if (value == null) { return false; }

  if (value.constructor === Uint8Array) { return true; }
  if (typeof(value) === "string") { return false; }
  if (!isInteger(value.length) || value.length < 0) { return false; }

  for (let i = 0; i < value.length; i++) {
    const v = value[i];
    if (!isInteger(v) || v < 0 || v >= 256) { return false; }
  }
  return true;
}

export function isHexString(value, length) {
  if (typeof(value) !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false
  }
  if (length && value.length !== 2 + 2 * length) { return false; }
  return true;
}

export function isBytesLike(value) {
  return ((isHexString(value) && !(value.length % 2)) || isBytes(value));
}

function addSlice(array) {
  if (array.slice) { return array; }

  array.slice = function() {
    const args = Array.prototype.slice.call(arguments);
    return addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)));
  }

  return array;
}

function isHexable(value){
  return !!(value.toHexString);
}
export function arrayify(value, options) {
  if (!options) { options = { }; }

  if (typeof(value) === "number") {
    logger.checkSafeUint53(value, "invalid arrayify value");

    const result = [];
    while (value) {
      result.unshift(value & 0xff);
      value = parseInt(String(value / 256));
    }
    if (result.length === 0) { result.push(0); }

    return addSlice(new Uint8Array(result));
  }

  if (options.allowMissingPrefix && typeof(value) === "string" && value.substring(0, 2) !== "0x") {
    value = "0x" + value;
  }

  if (isHexable(value)) { value = value.toHexString(); }

  if (isHexString(value)) {
    let hex = (value).substring(2);
      if (hex.length % 2) {
        if (options.hexPad === "left") {
        hex = "0x0" + hex.substring(2);
      } else if (options.hexPad === "right") {
        hex += "0";
      } else {
        logger.throwArgumentError("hex data is odd-length", "value", value);
      }
      }

      const result = [];
      for (let i = 0; i < hex.length; i += 2) {
        result.push(parseInt(hex.substring(i, i + 2), 16));
      }

      return addSlice(new Uint8Array(result));
      }

      if (isBytes(value)) {
        return addSlice(new Uint8Array(value));
      }

      return logger.throwArgumentError("invalid arrayify value", "value", value);
      }

export function hexlify(value, options) {
  if (!options) { options = { }; }

  if (typeof(value) === "number") {
    logger.checkSafeUint53(value, "invalid hexlify value");

    let hex = "";
    while (value) {
      hex = HexCharacters[value & 0xf] + hex;
      value = Math.floor(value / 16);
    }

    if (hex.length) {
      if (hex.length % 2) { hex = "0" + hex; }
      return "0x" + hex;
    }

    return "0x00";
  }

  if (typeof(value) === "bigint") {
    value = value.toString(16);
    if (value.length % 2) { return ("0x0" + value); }
    return "0x" + value;
  }

  if (options.allowMissingPrefix && typeof(value) === "string" && value.substring(0, 2) !== "0x") {
    value = "0x" + value;
  }

  if (isHexable(value)) { return value.toHexString(); }

  if (isHexString(value)) {
    if ((value).length % 2) {
      if (options.hexPad === "left") {
      value = "0x0" + (value).substring(2);
      } else if (options.hexPad === "right") {
      value += "0";
    } else {
      logger.throwArgumentError("hex data is odd-length", "value", value);
    }
      }
      return (value).toLowerCase();
      }

      if (isBytes(value)) {
      let result = "0x";
      for (let i = 0; i < value.length; i++) {
      let v = value[i];
      result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f];
    }
      return result;
    }

      return logger.throwArgumentError("invalid hexlify value", "value", value);
      }


export function zeroPad(value, length) {
  value = arrayify(value);

  if (value.length > length) {
    logger.throwArgumentError("value out of range", "value", arguments[0]);
  }

  const result = new Uint8Array(length);
  result.set(value, length - value.length);
  return addSlice(result);
}

export function hexZeroPad(value, length) {
  if (typeof(value) !== "string") {
    value = hexlify(value);
  } else if (!isHexString(value)) {
    logger.throwArgumentError("invalid hex string", "value", value);
  }

  if (value.length > 2 * length + 2) {
    logger.throwArgumentError("value out of range", "value", arguments[1]);
  }

  while (value.length < 2 * length + 2) {
    value = "0x0" + value.substring(2);
  }

  return value;
}

export function splitSignature(signature) {
  const result = {
    r: "0x",
    s: "0x",
    _vs: "0x",
    recoveryParam: 0,
    v: 0
  };

  if (isBytesLike(signature)) {
    const bytes = arrayify(signature);
    if (bytes.length !== 65) {
      logger.throwArgumentError("invalid signature string; must be 65 bytes", "signature", signature);
    }

    // Get the r, s and v
    result.r = hexlify(bytes.slice(0, 32));
    result.s = hexlify(bytes.slice(32, 64));
    result.v = bytes[64];

    // Allow a recid to be used as the v
    if (result.v < 27) {
      if (result.v === 0 || result.v === 1) {
        result.v += 27;
      } else {
        logger.throwArgumentError("signature invalid v byte", "signature", signature);
      }
    }

    // Compute recoveryParam from v
    result.recoveryParam = 1 - (result.v % 2);

    // Compute _vs from recoveryParam and s
    if (result.recoveryParam) { bytes[32] |= 0x80; }
    result._vs = hexlify(bytes.slice(32, 64))

  } else {
    result.r = signature.r;
    result.s = signature.s;
    result.v = signature.v;
    result.recoveryParam = signature.recoveryParam;
    result._vs = signature._vs;

    // If the _vs is available, use it to populate missing s, v and recoveryParam
    // and verify non-missing s, v and recoveryParam
    if (result._vs != null) {
      const vs = zeroPad(arrayify(result._vs), 32);
      result._vs = hexlify(vs);

      // Set or check the recid
      const recoveryParam = ((vs[0] >= 128) ? 1: 0);
      if (result.recoveryParam == null) {
        result.recoveryParam = recoveryParam;
      } else if (result.recoveryParam !== recoveryParam) {
        logger.throwArgumentError("signature recoveryParam mismatch _vs", "signature", signature);
      }

      // Set or check the s
      vs[0] &= 0x7f;
      const s = hexlify(vs);
      if (result.s == null) {
        result.s = s;
      } else if (result.s !== s) {
        logger.throwArgumentError("signature v mismatch _vs", "signature", signature);
      }
    }

    // Use recid and v to populate each other
    if (result.recoveryParam == null) {
      if (result.v == null) {
        logger.throwArgumentError("signature missing v and recoveryParam", "signature", signature);
      } else if (result.v === 0 || result.v === 1) {
        result.recoveryParam = result.v;
      } else {
        result.recoveryParam = 1 - (result.v % 2);
      }
    } else {
      if (result.v == null) {
        result.v = 27 + result.recoveryParam;
      } else {
        const recId = (result.v === 0 || result.v === 1) ? result.v :(1 - (result.v % 2));
        if (result.recoveryParam !== recId) {
          logger.throwArgumentError("signature recoveryParam mismatch v", "signature", signature);
        }
      }
    }

    if (result.r == null || !isHexString(result.r)) {
      logger.throwArgumentError("signature missing or invalid r", "signature", signature);
    } else {
      result.r = hexZeroPad(result.r, 32);
    }

    if (result.s == null || !isHexString(result.s)) {
      logger.throwArgumentError("signature missing or invalid s", "signature", signature);
    } else {
      result.s = hexZeroPad(result.s, 32);
    }

    const vs = arrayify(result.s);
    if (vs[0] >= 128) {
      logger.throwArgumentError("signature s out of range", "signature", signature);
    }
    if (result.recoveryParam) { vs[0] |= 0x80; }
    const _vs = hexlify(vs);

    if (result._vs) {
      if (!isHexString(result._vs)) {
        logger.throwArgumentError("signature invalid _vs", "signature", signature);
      }
      result._vs = hexZeroPad(result._vs, 32);
    }

    // Set or check the _vs
    if (result._vs == null) {
      result._vs = _vs;
    } else if (result._vs !== _vs) {
      logger.throwArgumentError("signature _vs mismatch v and s", "signature", signature);
    }
  }

  return result;
}


const HAS_TX_BEEN_INDEXED = `
  query($request: HasTxHashBeenIndexedRequest!) {
    hasTxHashBeenIndexed(request: $request) { 
	    ... on TransactionIndexedResult {
            indexed
            txReceipt {
                to
                from
                contractAddress
                transactionIndex
                root
                gasUsed
                logsBloom
                blockHash
                transactionHash
                blockNumber
                confirmations
                cumulativeGasUsed
                effectiveGasPrice
                byzantium
                type
                status
                logs {
                    blockNumber
                    blockHash
                    transactionIndex
                    removed
                    address
                    data
                    topics
                    transactionHash
                    logIndex
                }
            }
            metadataStatus {
              status
              reason
            }
        }
        ... on TransactionError {
            reason
            txReceipt {
                to
                from
                contractAddress
                transactionIndex
                root
                gasUsed
                logsBloom
                blockHash
                transactionHash
                blockNumber
                confirmations
                cumulativeGasUsed
                effectiveGasPrice
                byzantium
                type
                status
                logs {
                    blockNumber
                    blockHash
                    transactionIndex
                    removed
                    address
                    data
                    topics
                    transactionHash
                    logIndex
             }
            }
        },
        __typename
    }
  }
`;

const hasTxBeenIndexed = (txHash) => {
  return apolloClient.query({
    query: gql(HAS_TX_BEEN_INDEXED),
    variables: {
      request: {
        txHash,
      },
    },
    fetchPolicy: 'network-only',
  });
};

export const pollUntilIndexed = async (txHash) => {
  while (true) {
    const result = await hasTxBeenIndexed(txHash);
    console.log('pool until indexed: result', result.data);

    const response = result.data.hasTxHashBeenIndexed;
    if (response.__typename === 'TransactionIndexedResult') {
      console.log('pool until indexed: indexed', response.indexed);
      console.log('pool until metadataStatus: metadataStatus', response.metadataStatus);

      if (response.metadataStatus) {
        if (response.metadataStatus.status === 'SUCCESS') {
          return response;
        }

        if (response.metadataStatus.status === 'METADATA_VALIDATION_FAILED') {
          throw new Error(response.metadataStatus.reason);
        }
      } else {
        if (response.indexed) {
          return response;
        }
      }

      console.log('pool until indexed: sleep for 1500 milliseconds then try again');
      // sleep for a second before trying again
      //Timeout promise
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } else {
      // it got reverted and failed!
      throw new Error(response.reason);
    }
  }
};
