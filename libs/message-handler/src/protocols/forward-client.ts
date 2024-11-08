import {
  DIDDoc,
  DIDResolver,
  IMessage,
  Message,
  SecretsResolver,
} from 'didcomm';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import PeerDIDResolver from '../../../did-resolver-lib/src/resolver';
import {
  ExampleDIDResolver,
  ExampleSecretsResolver,
} from '../../../did-resolver-lib/src/ExampleDIDResolver';
import { FROM } from '../did_doc/client';
import { ROUTING } from '../shared_data/message_types';
import { CLIENT_SECRETS } from '../secrets/client';
import { MEDIATOR_ENDPOINT } from '../shared_data/endpoints';
import { CONTENT_TYPE } from '../shared_data/constant';

export function buildMessage(to: string[], message: unknown): Message {
  const imsg: IMessage = {
    id: uuidv4(),
    typ: 'application/didcomm-plain+json',
    type: ROUTING,
    body: {},
    from: FROM,
    to: to,
    attachments: [
      {
        data: {
          json: { data: message },
        },
        id: uuidv4(),
        description: 'example',
        media_type: 'application/didcomm-encrypted+json',
      },
    ],
  };
  const msg = new Message(imsg);
  return msg;
}
export async function forward_msg(to: string[], message: string) {
  const msg = buildMessage(to, message);

  const packed_msg = await pack_encrypt(msg, to);
  await sendRequest(packed_msg as string);
}

export async function pack_encrypt(
  msg: Message,
  to: string[],
): Promise<string | null> {
  const mediator_didoc = await new PeerDIDResolver().resolve(to[0]);

  const did_resolver: DIDResolver = new ExampleDIDResolver([
    mediator_didoc as DIDDoc,
  ]);
  const secret_resolver: SecretsResolver = new ExampleSecretsResolver(
    CLIENT_SECRETS,
  );

  try {
    const result = await msg.pack_encrypted(
      to[0],
      FROM,
      null,
      did_resolver,
      secret_resolver,
      {
        forward: true,
      },
    );
    return result[0];
  } catch (error) {
    throw new Error(error as string);
  }
}
export async function sendRequest(packed_msg: string) {
  try {
    await axios.post(MEDIATOR_ENDPOINT, packed_msg, {
      headers: {
        'Content-type': CONTENT_TYPE,
      },
    });
  } catch (error) {
    throw new Error(error as string);
  }
}
