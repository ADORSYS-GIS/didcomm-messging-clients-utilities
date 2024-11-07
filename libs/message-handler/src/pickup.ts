import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { DIDDoc, Message, PackEncryptedOptions, UnpackOptions } from 'didcomm';
import { ExampleDIDResolver, ExampleSecretsResolver } from '../../did-resolver-lib/src/ExampleDIDResolver';
import PeerDIDResolver from '../../did-resolver-lib/src/resolver';

import { ALICE_DID, PICKUP_DELIVERY_3_0, PICKUP_RECEIVE_3_0, PICKUP_REQUEST_3_0, SERVICE_ENDPOINT } from './constants/message-type';
import { CLIENT_SECRETS } from './secrets/client';
import { FROM } from './did/client';


const buildPickupRequestMessage = async (to: string, recipient_did: string): Promise<Message> => {
  return new Message({
    id: `urn:uuid:${uuidv4()}`,
    typ: "application/didcomm-plain+json",
    type: PICKUP_REQUEST_3_0,
    from: FROM,
    to: [to],
    body: {
      recipient_did: recipient_did,
    },
    return_route: "all",
  });
};
// Function to send a pickup request
const sendPickupRequest = async (recipientDid: string, to: string): Promise<Message | null> => {
  try {
    const MEDIDOC = await new PeerDIDResolver().resolve(to)
    const did_resolver = new ExampleDIDResolver([MEDIDOC as DIDDoc]);
    const secrets_resolver = new ExampleSecretsResolver(CLIENT_SECRETS);
    const msg = await buildPickupRequestMessage(to, recipientDid);
    const options: PackEncryptedOptions = { forward: false };
    const encryptedMsg = await msg.pack_encrypted(
      to,
      FROM,
      null,
      did_resolver,
      secrets_resolver,
      options
    );
    console.log(encryptedMsg[0])
    await axios.post(SERVICE_ENDPOINT, encryptedMsg[0], {
      headers: { 'Content-Type': 'application/didcomm-encrypted+json' }
    });
    const message = await handleUnpackResponse(to, recipientDid);
    return message
  } catch (error) {
    throw Error(error as string)
  }
};
// Function to build a pickup delivery request message
const buildPickupDeliveryRequestMessage = async (recipientDid: string, to: string): Promise<Message> => {
  return new Message({
    id: `urn:uuid:${uuidv4()}`,
    typ: "application/didcomm-plain+json",
    type: PICKUP_DELIVERY_3_0,
    from: FROM,
    to: [to],
    body: {
      recipient_did: recipientDid,
    },
    return_route: "all",
  });
};
// Function to send a pickup delivery request
const sendPickupDeliveryRequest = async (recipientDid: string, to: string): Promise<Message | null> => {
  try {

    const MEDIDOC = await new PeerDIDResolver().resolve(to)
    const did_resolver = new ExampleDIDResolver([MEDIDOC as DIDDoc]);
    const secrets_resolver = new ExampleSecretsResolver(CLIENT_SECRETS);

    const msg = await buildPickupDeliveryRequestMessage(to, recipientDid);
    const options: PackEncryptedOptions = { forward: false };
    const encryptedMsg = await msg.pack_encrypted(
      to,
      FROM,
      null,
      did_resolver,
      secrets_resolver,
      options
    );
    const response = await axios.post(SERVICE_ENDPOINT, encryptedMsg[0], {
      headers: { 'Content-Type': 'application/didcomm-encrypted+json' }
    });
    const message = await handleUnpackResponse(to, response.data);
    return message
  } catch (error) {
    throw Error(error as string)
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
const sendPickupMessageReceived = async (to: string, recipientDid: string, messageIds: string[], mediationEndpoint: string): Promise<void> => {
  try {
    const MEDIDOC = await new PeerDIDResolver().resolve(to)
    const did_resolver = new ExampleDIDResolver([MEDIDOC as DIDDoc]);
    const secrets_resolver = new ExampleSecretsResolver(CLIENT_SECRETS);
    const msg = await buildPickupMessageReceivedMessage(recipientDid, messageIds);
    const options: PackEncryptedOptions = { forward: false };
    const [encryptedMsg] = await msg.pack_encrypted(
      recipientDid,
      FROM,
      null,
      did_resolver,
      secrets_resolver,
      options
    );
    const response = await axios.post(mediationEndpoint, encryptedMsg, {
      headers: { 'Content-Type': 'application/didcomm-encrypted+json' }
    });
    await handleUnpackResponse(to, response.data);
  } catch (error) {
    console.error("Error during pickup message received:", (error as Error).message);
  }
};
// Function to handle unpacking response
async function handleUnpackResponse(to: string, packedMsg: string): Promise<Message> {
  try {
    const MEDIDOC = await new PeerDIDResolver().resolve(to)
    const did_resolver = new ExampleDIDResolver([MEDIDOC as DIDDoc]);
    const secrets_resolver = new ExampleSecretsResolver(CLIENT_SECRETS);
    const unpackOptions: UnpackOptions = {};
    const unpackedMsg = await Message.unpack(
      packedMsg,
      did_resolver,
      secrets_resolver,
      unpackOptions
    );
    return unpackedMsg[0]
  } catch (error) {
    throw Error(error as string)
  }
};
export { sendPickupRequest, sendPickupDeliveryRequest, sendPickupMessageReceived, buildPickupDeliveryRequestMessage, buildPickupMessageReceivedMessage, handleUnpackResponse };