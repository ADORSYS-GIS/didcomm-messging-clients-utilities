import { v4 as uuidv4 } from 'uuid';
import { DIDDoc, Message } from 'didcomm';
import {
  ExampleDIDResolver,
  ExampleSecretsResolver,
  PeerDIDResolver,
} from 'did-resolver-lib';

import {
  PICKUP_DELIVERY_3_0,
  PICKUP_RECEIVE_3_0,
  PICKUP_REQUEST_3_0,
  SERVICE_ENDPOINT,
} from './protocols/message_types';
import { CLIENT_SECRETS } from './secrets/client';
import { FROM } from './shared_data/constants';

export async function pickupRequest(to: string, recipient_did: string) {
  const type = PICKUP_REQUEST_3_0;
  const msg: Message = buildMessage(to, recipient_did, type);
  const packmsg = await pack_encrypt(msg, to);
  // send packmsg to mediator
  const response = await sendRequest(packmsg as string);
  const unpackedMsg: Message = await handleResponse(to, response as string);
  return unpackedMsg;
}
export async function pickupDelivery(
  to: string,
  recipient_did: string,
  limit: number | null = null,
) {
  const type = PICKUP_DELIVERY_3_0;
  const msg: Message = buildMessage(to, recipient_did, type, limit);
  const packmsg = await pack_encrypt(msg, to);
  // send packmsg to mediator
  const response = await sendRequest(packmsg as string);
  const unpackedMsg: Message = await handleResponse(to, response as string);
  return unpackedMsg;
}

export async function pickupReceive(
  to: string,
  recipient_did: string,
  message_id_list: string[],
) {
  const type = PICKUP_RECEIVE_3_0;
  const msg: Message = buildMessage(
    to,
    recipient_did,
    type,
    null,
    message_id_list,
  );
  const packmsg = await pack_encrypt(msg, to);
  // send packmsg to mediator
  const response = await sendRequest(packmsg as string);
  const unpackedMsg: Message = await handleResponse(to, response as string);
  return unpackedMsg;
}

export function buildMessage(
  to: string,
  recipient_did: string,
  type: string,
  limit: number | null = null,
  message_id_list: string[] | null = null,
): Message {
  return new Message({
    id: `urn:uuid:${uuidv4()}`,
    typ: 'application/didcomm-plain+json',
    type: type,
    from: FROM,
    to: [to],
    body: {
      recipient_did: recipient_did,
      limit: limit,
      message_id_list: message_id_list,
    },
    return_route: 'all',
  });
}

export async function pack_encrypt(msg: Message, to: string): Promise<string> {
  const MEDIDOC = await new PeerDIDResolver().resolve(to);
  const SENDERDOC = await new PeerDIDResolver().resolve(FROM);
  const did_resolver = new ExampleDIDResolver([
    MEDIDOC as DIDDoc,
    SENDERDOC as DIDDoc,
  ]);
  const secrets_resolver = new ExampleSecretsResolver(CLIENT_SECRETS);

  const encryptedMsg = await msg.pack_encrypted(
    to,
    FROM,
    null,
    did_resolver,
    secrets_resolver,
    {
      forward: false,
    },
  );
  return encryptedMsg[0];
}

// Function to send a pickup request
export async function sendRequest(msg: string): Promise<string> {
  if (typeof msg !== 'string') {
    throw new Error('Packed message is not a valid string.');
  }

  // console.log('Sending Packed Message:', msg);
  try {
    const response = await fetch(SERVICE_ENDPOINT, {
      method: 'POST',
      body: msg,
      headers: {
        'Content-Type': 'application/didcomm-encrypted+json',
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${responseText}`,
      );
    }

    return responseText;
  } catch (error) {
    console.error('Error sending pickup request:', error);
    throw error;
  }
}

// Function to handle unpacking response
export async function handleResponse(
  to: string,
  msg: string,
): Promise<Message> {
  console.log(msg);
  try {
    const MEDIDOC = await new PeerDIDResolver().resolve(to);
    const SENDERDOC = await new PeerDIDResolver().resolve(FROM);
    const did_resolver = new ExampleDIDResolver([
      MEDIDOC as DIDDoc,
      SENDERDOC as DIDDoc,
    ]);
    const secrets_resolver = new ExampleSecretsResolver(CLIENT_SECRETS);

    const unpackedMsg = await Message.unpack(
      msg,
      did_resolver,
      secrets_resolver,
      {},
    );
    return unpackedMsg[0];
  } catch (error) {
    throw new Error(error as string);
  }
}
