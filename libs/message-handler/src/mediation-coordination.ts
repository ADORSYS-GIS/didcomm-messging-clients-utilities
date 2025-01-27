import { DIDDoc, IMessage, Message } from 'didcomm';
import { DIDResolver, SecretsResolver } from 'didcomm';
import {
  ExampleDIDResolver,
  ExampleSecretsResolver,
  PeerDIDResolver,
} from 'did-resolver-lib';
import { v4 as uuidv4 } from 'uuid';

enum Action {
  add = 'add',
  remove = 'remove',
}
import { CLIENT_SECRETS } from './secrets/client';
import {
  KEYLIST_QUERY,
  KEYLIST_UPDATE,
  MEDIATE_REQUEST,
} from './protocols/message_types';
import { CONTENT_TYPE, FROM, SERVICE_ENDPOINT } from './shared_data/constants';

/**
 * @function Mediation_Coordination
 * @description Coordinates the mediation process by sending a mediation request and updating the keylist based on the response
 * @param  mediatorDid - The mediator's did
 * @returns {Promise<string | undefined>} - Returns the routing DID if successful, or undefined if mediation is denied
 **/
export default async function mediationCoordination(
  mediatorDid: string,
  recipient_did: string,
): Promise<Message | undefined> {
  // Send a mediation request and receive the response
  const mediation_response: Message = await mediateRequest([mediatorDid]);
  return mediation_response;

  //Extract the body from the mediation response
  const message: IMessage = mediation_response.as_value();

  // Retrieve the routing DID from the response body
  const routing_did = message.body?.routing_did;

  // Update the keylist with the provided action and recipient DID
  if (!routing_did) {
    // Handle error if mediation is denied
    throw new Error('Mediation Deny');
  }

  keylistUpdate(recipient_did, Action.add, [mediatorDid]);
  return routing_did;
}

export async function buildMsg(
  mediatorDid: string[],
  type: string,
  body: object,
): Promise<IMessage> {
  const val: IMessage = {
    id: uuidv4(),
    typ: 'application/didcomm-plain+json',
    type: type,
    body: body,
    from: FROM,
    to: mediatorDid,
    return_route: 'all',
  };
  return val;
}
export async function packEncrypted(message: IMessage) {
  const msg = new Message(message);
  const to = message.to as string[];
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
    throw Error(('Error packing message: ' + error) as string);
  }
}

/**

 
* @function mediate_request
* @description Build and pack a mediation request message,
* and send it to the mediator. Unpack the response and return
* the unpacked message.
* @param mediatorDid - The mediator's DID 
* @returns {Promise<Message>}
*/
export async function mediateRequest(mediatorDid: string[]): Promise<Message> {
  const body = {};
  const type = MEDIATE_REQUEST;

  const msg = await buildMsg(mediatorDid, type, body);
  const packed_msg = await packEncrypted(msg);
  const data = await sendRequest(packed_msg);

  const unpackedMsg = await unpack(data as string, mediatorDid);
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
      throw Error('Error sending didcomm request' + error);
    });
  return data;
}

export async function keylistUpdate(
  recipient_did: string,
  action: Action,
  mediatorDid: string[],
) {
  const body = {
    updates: [
      {
        recipient_did: recipient_did[0],
        action: action,
      },
    ],
  };

  const msg = await buildMsg(mediatorDid, KEYLIST_UPDATE, body);
  const packed_msg = packEncrypted(msg);
  const data = await sendRequest(await packed_msg);
  const unpackedMsg = unpack(data as string, mediatorDid);

  return unpackedMsg;
}

export async function keylistQuery(
  mediator: string[],
): Promise<Message | null> {
  const body = {};
  const msg = await buildMsg(mediator, KEYLIST_QUERY, body);
  const packed_msg = await packEncrypted(msg);
  const data = await sendRequest(packed_msg);

  const unpackedMsg = unpack(data as string, mediator);
  return unpackedMsg;
}

export async function unpack(
  msg: string,
  recipient: string[],
): Promise<Message | null> {
  const resolve = await resolvers(recipient);
  const resolver = resolve as [DIDResolver, SecretsResolver];
  const did_resolver = resolver[0];
  const secret_resolver = resolver[1];

  const unpackedMsg = await Message.unpack(
    msg,
    did_resolver,
    secret_resolver,
    {},
  );
  return unpackedMsg[0];
}

export async function resolvers(
  mediator: string[],
): Promise<[DIDResolver, SecretsResolver] | null> {
  const DIDDoc = await new PeerDIDResolver().resolve(mediator[0]);
  const CLIENT_DIDDoc = await new PeerDIDResolver().resolve(FROM);
  const did_resolver: DIDResolver = new ExampleDIDResolver([
    CLIENT_DIDDoc as DIDDoc,
    DIDDoc as DIDDoc,
  ]);
  const secret_resolver: SecretsResolver = new ExampleSecretsResolver(
    CLIENT_SECRETS,
  );
  return [did_resolver, secret_resolver];
}
