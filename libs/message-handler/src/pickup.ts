import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { DIDDoc, Message, PackEncryptedOptions, UnpackOptions } from 'didcomm';
import {
  ExampleDIDResolver,
  ExampleSecretsResolver,
} from '../../did-resolver-lib/src/ExampleDIDResolver';
import PeerDIDResolver from '../../did-resolver-lib/src/resolver';

import {
  PICKUP_DELIVERY_3_0,
  PICKUP_RECEIVE_3_0,
  
  PICKUP_REQUEST_3_0,
  SERVICE_ENDPOINT,
} from './constants/message-type';
import { CLIENT_SECRETS } from './secrets/client';
import { FROM } from './did/client';

// Extend the Message type to include a body property
interface MessageWithBody extends Message {
  body: Record<string, unknown>;
}

const buildPickupRequestMessage = async (
  to: string,
  recipient_did: string,
): Promise<MessageWithBody> => {
  return new Message({
    id: `urn:uuid:${uuidv4()}`,
    typ: 'application/didcomm-plain+json',
    type: PICKUP_REQUEST_3_0,
    from: FROM,
    to: [to],
    body: {
      recipient_did: recipient_did,
    },
    return_route: 'all',
  }) as MessageWithBody;
};

// Function to send a pickup request
const sendPickupRequest = async (
  recipientDid: string,
  to: string,
): Promise<MessageWithBody | null> => {
  try {
    const MEDIDOC = await new PeerDIDResolver().resolve(to);
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
      options,
    );
    console.log(encryptedMsg[0]);
    const response = await axios.put(SERVICE_ENDPOINT, encryptedMsg[0], {
      headers: { 'Content-Type': 'application/didcomm-encrypted+json' },
    });
    const message = await handleUnpackResponse(to, response.data);
    return message;
  } catch (error) {
    throw Error(error as string);
  }
};

// Function to build a pickup delivery request message
const buildPickupDeliveryRequestMessage = async (
  recipientDid: string,
  to: string,
): Promise<MessageWithBody> => {
  return new Message({
    id: `urn:uuid:${uuidv4()}`,
    typ: 'application/didcomm-plain+json',
    type: PICKUP_DELIVERY_3_0,
    from: FROM,
    to: [to],
    body: {
      recipient_did: recipientDid,
    },
    return_route: 'all',
  }) as MessageWithBody;
};

// Function to send a pickup delivery request
const sendPickupDeliveryRequest = async (
  recipientDid: string,
  to: string,
): Promise<MessageWithBody | null> => {
  try {
    const MEDIDOC = await new PeerDIDResolver().resolve(to);
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
      options,
    );
    const response = await axios.put(SERVICE_ENDPOINT, encryptedMsg[0], {
      headers: { 'Content-Type': 'application/didcomm-encrypted+json' },
    });
    const message = await handleUnpackResponse(to, response.data);
    return message;
  } catch (error) {
    throw Error(error as string);
  }
};

// Function to build a pickup message received message
const buildPickupMessageReceivedMessage = async (
  recipientDid: string,
  messageIds: string[],
): Promise<MessageWithBody> => {
  return new Message({
    id: `urn:uuid:${uuidv4()}`,
    typ: 'application/didcomm-plain+json',
    type: PICKUP_RECEIVE_3_0,
    from: FROM,
    to: [recipientDid],
    body: {
      message_id_list: messageIds,
    },
    return_route: 'all',
  }) as MessageWithBody;
};

// Function to send a pickup message received
const sendPickupMessageReceived = async (
  to: string,
  recipientDid: string,
  messageIds: string[],
  mediationEndpoint: string,
): Promise<void> => {
  try {
    const MEDIDOC = await new PeerDIDResolver().resolve(to);
    const did_resolver = new ExampleDIDResolver([MEDIDOC as DIDDoc]);
    const secrets_resolver = new ExampleSecretsResolver(CLIENT_SECRETS);
    const msg = await buildPickupMessageReceivedMessage(
      recipientDid,
      messageIds,
    );
    const options: PackEncryptedOptions = { forward: false };
    const [encryptedMsg] = await msg.pack_encrypted(
      recipientDid,
      FROM,
      null,
      did_resolver,
      secrets_resolver, 
      options,
    );
    const response = await axios.post(mediationEndpoint, encryptedMsg, {
      headers: { 'Content-Type': 'application/didcomm-encrypted+json' },
    });
    await handleUnpackResponse(to, response.data);
  } catch (error) {
    console.error(
      'Error during pickup message received:',
      (error as Error).message,
    );
  }
};

// Function to handle unpacking response
async function handleUnpackResponse(
  to: string,
  packedMsg: string,
): Promise<MessageWithBody> {
  try {
    const MEDIDOC = await new PeerDIDResolver().resolve(to);
    const did_resolver = new ExampleDIDResolver([MEDIDOC as DIDDoc]);
    const secrets_resolver = new ExampleSecretsResolver(CLIENT_SECRETS);
    const unpackOptions: UnpackOptions = {};
    const unpackedMsg = await Message.unpack(
      packedMsg,
      did_resolver,
      secrets_resolver,
      unpackOptions,
    );
    return unpackedMsg[0] as MessageWithBody;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error unpacking message: ${error.message}`);
      if (error.name === 'DIDCommMalformed') {
        console.error(`Malformed message: ${error.message}`);
      }
    } else {
      console.error(`Unknown error: ${error}`);
    }
    
    throw error;
  } finally {
    console.log('Message unpacked successfully');
  }
}

export {
  sendPickupRequest,
  sendPickupDeliveryRequest,
  sendPickupMessageReceived,
  buildPickupDeliveryRequestMessage,
  buildPickupMessageReceivedMessage,
  handleUnpackResponse,
};