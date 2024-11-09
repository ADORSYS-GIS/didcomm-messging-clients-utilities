import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { DIDDoc, IMessage, Message, PackEncryptedOptions, UnpackOptions } from 'didcomm';
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


export async function pickupRequest(to: string, recipient_did: string) {

  const type = PICKUP_REQUEST_3_0;
  const msg: Message = buildMessage(to, recipient_did, type);
  const packmsg = await pack_encrypt(msg, to);
  // send packmsg to mediator
  const response = await sendRequest(packmsg as string)
  const unpackedMsg: Message = await handleResponse(to, response as string)
  return unpackedMsg

}
export async function pickupDelivery(to: string, recipient_did: string) {
  const type = PICKUP_DELIVERY_3_0;
  const msg: Message = buildMessage(to, recipient_did, type);
  const packmsg = await pack_encrypt(msg, to);
  // send packmsg to mediator
  const response = await sendRequest(packmsg as string)
  const unpackedMsg: Message = await handleResponse(to, response as string)
  return unpackedMsg
}

export async function pickupReceive(to: string, recipient_did: string) {
  const type = PICKUP_RECEIVE_3_0;
  const msg: Message = buildMessage(to, recipient_did, type);
  const packmsg = await pack_encrypt(msg, to);
  // send packmsg to mediator
  const response = await sendRequest(packmsg as string)
  const unpackedMsg: Message = await handleResponse(to, response as string)
  return unpackedMsg
}

export function buildMessage(
  to: string,
  recipient_did: string,
  type: string,
): Message {
  return new Message({
    id: `urn:uuid:${uuidv4()}`,
    typ: 'application/didcomm-plain+json',
    type: type,
    from: FROM,
    to: [to],
    body: {
      recipient_did: recipient_did,
    },
    return_route: 'all',
  })
};


export async function pack_encrypt(msg: Message, to: string): Promise<string | null> {

  const MEDIDOC = await new PeerDIDResolver().resolve(to);
  const SENDERDOC = await new PeerDIDResolver().resolve(FROM)
  const did_resolver = new ExampleDIDResolver([MEDIDOC as DIDDoc, SENDERDOC as DIDDoc]);
  const secrets_resolver = new ExampleSecretsResolver(CLIENT_SECRETS);

  const encryptedMsg = await msg.pack_encrypted(
    to,
    FROM,
    null,
    did_resolver,
    secrets_resolver,
    {},
  );
  return encryptedMsg[0]
}

// Function to send a pickup request
export async function sendRequest(
  packmsg: string,
): Promise<string | null> {

  const response = await axios.post(SERVICE_ENDPOINT, packmsg, {
    headers: { 'Content-Type': 'application/didcomm-encrypted+json' },
  });
  const data = response.data;
  return data
}


// Function to handle unpacking response
export async function handleResponse(
  to: string,
  packedMsg: string,
): Promise<Message> {
  try {
    const MEDIDOC = await new PeerDIDResolver().resolve(to);
    const SENDERDOC = await new PeerDIDResolver().resolve(FROM)
    const did_resolver = new ExampleDIDResolver([MEDIDOC as DIDDoc, SENDERDOC as DIDDoc]);
    const secrets_resolver = new ExampleSecretsResolver(CLIENT_SECRETS);
    const unpackOptions: UnpackOptions = {};
    const unpackedMsg = await Message.unpack(
      packedMsg,
      did_resolver,
      secrets_resolver,
      unpackOptions,
    );
    return unpackedMsg[0]
  } catch (error) {
    throw new Error(error as string)
  }
}

