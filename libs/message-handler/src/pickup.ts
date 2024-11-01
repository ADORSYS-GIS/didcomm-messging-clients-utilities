import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Message, PackEncryptedOptions, UnpackOptions } from 'didcomm';
export { sendPickupRequest, sendPickupDeliveryRequest, sendPickupMessageReceived };
import { ExampleDIDResolver, ExampleSecretsResolver } from '../../did-resolver-lib/src/ExampleDIDResolver';

// Constants
const ALICE_DID = process.env.ALICE_DID || "did:key:z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM";
const PICKUP_REQUEST_3_0 = "https://didcomm.org/pickup-request/3.0";
const PICKUP_DELIVERY_3_0 = "https://didcomm.org/pickup-delivery/3.0";
const PICKUP_RECEIVE_3_0 = "https://didcomm.org/pickup-receive/3.0";

// Create example resolvers
const didResolver = new ExampleDIDResolver([]);
const secretsResolver = new ExampleSecretsResolver([]);

// Function to build a pickup request message
const buildPickupRequestMessage = async (recipientDid: string): Promise<Message> => {
  return new Message({
    id: `urn:uuid:${uuidv4()}`,
    typ: "application/didcomm-plain+json",
    type: PICKUP_REQUEST_3_0,
    from: ALICE_DID,
    to: [recipientDid],
    body: {
      recipient_did: recipientDid,
    },
    return_route: "all",
  });
};

// Function to send a pickup request
const sendPickupRequest = async (recipientDid: string, mediationEndpoint: string): Promise<void> => {
  try {
    const msg = await buildPickupRequestMessage(recipientDid);
    const options: PackEncryptedOptions = { forward: false };

    const [encryptedMsg] = await msg.pack_encrypted(
      recipientDid,
      ALICE_DID,
      null,
      didResolver,
      secretsResolver,
      options
    );

    const response = await axios.post(mediationEndpoint, encryptedMsg, {
      headers: { 'Content-Type': 'application/didcomm-encrypted+json' }
    });

    await handleUnpackResponse(response.data);
  } catch (error) {
    console.error("Error during pickup request:", (error as Error).message);
  }
};

// Function to build a pickup delivery request message
const buildPickupDeliveryRequestMessage = async (recipientDid: string): Promise<Message> => {
  return new Message({
    id: `urn:uuid:${uuidv4()}`,
    typ: "application/didcomm-plain+json",
    type: PICKUP_DELIVERY_3_0,
    from: ALICE_DID,
    to: [recipientDid],
    body: {
      recipient_did: recipientDid,
    },
    return_route: "all",
  });
};

// Function to send a pickup delivery request
const sendPickupDeliveryRequest = async (recipientDid: string, mediationEndpoint: string): Promise<void> => {
  try {
    const msg = await buildPickupDeliveryRequestMessage(recipientDid);
    const options: PackEncryptedOptions = { forward: false };

    const [encryptedMsg] = await msg.pack_encrypted(
      recipientDid,
      ALICE_DID,
      null,
      didResolver,
      secretsResolver,
      options
    );

    const response = await axios.post(mediationEndpoint, encryptedMsg, {
      headers: { 'Content-Type': 'application/didcomm-encrypted+json' }
    });

    await handleUnpackResponse(response.data);
  } catch (error) {
    console.error("Error during pickup delivery request:", (error as Error).message);
  }
};

// Function to build a pickup message received message
const buildPickupMessageReceivedMessage = async (recipientDid: string, messageIds: string[]): Promise<Message> => {
  return new Message({
    id: `urn:uuid:${uuidv4()}`,
    typ: "application/didcomm-plain+json",
    type: PICKUP_RECEIVE_3_0,
    from: ALICE_DID,
    to: [recipientDid],
    body: {
      message_id_list: messageIds,
    },
    return_route: "all",
  });
};

// Function to send a pickup message received
const sendPickupMessageReceived = async (recipientDid: string, messageIds: string[], mediationEndpoint: string): Promise<void> => {
  try {
    const msg = await buildPickupMessageReceivedMessage(recipientDid, messageIds);
    const options: PackEncryptedOptions = { forward: false };

    const [encryptedMsg] = await msg.pack_encrypted(
      recipientDid,
      ALICE_DID,
      null,
      didResolver,
      secretsResolver,
      options
    );

    const response = await axios.post(mediationEndpoint, encryptedMsg, {
      headers: { 'Content-Type': 'application/didcomm-encrypted+json' }
    });

    await handleUnpackResponse(response.data);
  } catch (error) {
    console.error("Error during pickup message received:", (error as Error).message);
  }
};

// Function to handle unpacking response
const handleUnpackResponse = async (packedMsg: string): Promise<void> => {
  try {
    const unpackOptions: UnpackOptions = {};
    const [unpackedMsg] = await Message.unpack(
      packedMsg,
      didResolver,
      secretsResolver,
      unpackOptions
    );
    await processUnpackedMessage(unpackedMsg);
  } catch (error) {
    console.error("Error during unpacking response:", (error as Error).message);
    throw error;
  }
};

// Function to process unpacked message
const processUnpackedMessage = async (unpackedMsg: Message): Promise<void> => {
  console.log('Processing unpacked message:', unpackedMsg);
};

