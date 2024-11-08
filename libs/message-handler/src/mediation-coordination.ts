import { DIDDoc, IMessage, Message } from 'didcomm';
import PeerDIDResolver from '../../did-resolver-lib/src/resolver';
import { DIDResolver, SecretsResolver } from 'didcomm';
import ExampleSecretsResolver, {
  ExampleDIDResolver,
} from '../../did-resolver-lib/src/ExampleDIDResolver';
import { CLIENT_SECRETS } from './secrets/client';
import {
  KEYLIST_QUERY,
  KEYLIST_UPDATE,
  MEDIATE_REQUEST,
} from './protocols/message_types';
import { CONTENT_TYPE, FROM, SERVICE_ENDPOINT } from './shared_data/constants';

/**
 * @function Mediation_Coordinaton
 * @description Coordinates the mediation process by sending a mediation request and updating the keylist based on the response.
 * @param {string[]} to - The recipient DID(s) of the message
 * @param {string} recipient_did - The recipient DID of the mediation request
 * @param {string} action - The action to be taken for the keylist update
 * @returns {Promise<string | undefined>} - Returns the routing DID if successful, or undefined if mediation is denied
 */
export default async function mediationCoordinaton(
  to: string[],
  recipient_did: string,
  action: string,
): Promise<string | undefined> {
  // Send a mediation request and receive the response
  const mediation_response: Message = await mediateRequest(to, recipient_did);

  // Extract the body from the mediation response
  const message: IMessage = mediation_response.as_value();

  // Retrieve the routing DID from the response body
  const routing_did = message.body?.routing_did;

  // Update the keylist with the provided action and recipient DID
  if (routing_did) {
    keylistUpdate(recipient_did, action, to);
    return routing_did;
  }

  // Handle error if mediation is denied
  throw new Error('Mediation Deny');
}

export async function buildMsg(
  to: string[],
  type: string,
  body: object,
): Promise<IMessage> {
  if (!to || to.length === 0) {
    throw new Error('to is empty');
  }

  const val: IMessage = {
    id: 'uuid',
    typ: 'application/didcomm-plain+json',
    type: type,
    body: body,
    from: FROM,
    to: to,
    headers: { return_route: 'all' },
  };
  return val;
}
export async function pack_encrypted(to: string[], message: IMessage) {
  const msg = new Message(message);
  const CLIENT_DIDDOC: DIDDoc | null = await new PeerDIDResolver().resolve(
    FROM,
  );

  const MEDIATOR_DIDDOC: DIDDoc | null = await new PeerDIDResolver().resolve(
    to[0],
  );

  const did_resolver: DIDResolver = new ExampleDIDResolver([
    CLIENT_DIDDOC as DIDDoc,
    MEDIATOR_DIDDOC as DIDDoc,
  ]);
  const secret_resolver: SecretsResolver = new ExampleSecretsResolver(
    CLIENT_SECRETS,
  );
  try {
    const packed_msg = await msg.pack_encrypted(
      to[0],
      FROM,
      null,
      did_resolver,
      secret_resolver,
      {
        forward: false,
      },
    );

    return packed_msg[0];
  } catch (error) {
    throw Error(error as string);
  }
}

/**

 
* @function mediate_request
* @description Build and pack a mediation request message,
* and send it to the mediator. Unpack the response and return
* the unpacked message.
* @param {string[]} to - The recipient DID(s) of the message
* @param {string} recipient_did - The recipient DID of the mediation request
* @returns {Promise<Message>}
*/
export async function mediateRequest(
  to: string[],
  recipient_did: string,
): Promise<Message> {
  const body = { recipient_did: recipient_did };
  const type = MEDIATE_REQUEST;

  const msg = await buildMsg(to, type, body);
  const packed_msg = await pack_encrypted(to, msg);
  const data = await sendRequest(packed_msg);

  const unpackedMsg = await unpack(data as string, to);
  return unpackedMsg as Message;
}
export async function sendRequest(msg: string): Promise<string | null> {
  const data = fetch(SERVICE_ENDPOINT, {
    method: 'POST',
    body: msg,
    headers: {
      'Content-Type': CONTENT_TYPE,
    },
  })
    .then((response) => {
      const data = response.text();
      return data;
    })
    .catch((error) => {
      throw Error(error);
    });
  return data;
}

export async function keylistUpdate(
  recipient_did: string,
  action: string,
  to: string[],
) {
  const body = {
    updates: [
      {
        recipient_did: recipient_did[0],
        action: action,
      },
    ],
  };

  const msg = await buildMsg(to, KEYLIST_UPDATE, body);
  const packed_msg = pack_encrypted(to, msg);
  const data = await sendRequest(await packed_msg);
  const unpackedMsg = unpack(data as string, to);

  return unpackedMsg;
}

export async function keylistQuery(
  to: string,
  recipient_did: string[],
): Promise<Message | null> {
  const body = {};
  const msg = await buildMsg(recipient_did, KEYLIST_QUERY, body);
  const packed_msg = await pack_encrypted([to], msg);
  const data = await sendRequest(packed_msg);

  const unpackedMsg = unpack(data as string, [to]);
  return unpackedMsg;
}

export async function unpack(
  msg: string,
  to: string[],
): Promise<Message | null> {
  const DIDDoc = await new PeerDIDResolver().resolve(to[0]);
  const CLIENT_DIDDoc = await new PeerDIDResolver().resolve(FROM);
  const did_resolver: DIDResolver = new ExampleDIDResolver([
    CLIENT_DIDDoc as DIDDoc,
    DIDDoc as DIDDoc,
  ]);
  const secret_resolver: SecretsResolver = new ExampleSecretsResolver(
    CLIENT_SECRETS,
  );
  const unpackedMsg = await Message.unpack(
    msg,
    did_resolver,
    secret_resolver,
    {},
  );
  return unpackedMsg[0];
}
