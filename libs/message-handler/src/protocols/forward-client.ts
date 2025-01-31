// import  {ap_in_forward } from didcomm
import {
  DIDDoc,
  DIDResolver,
  IMessage,
  Message,
  SecretsResolver,
} from 'didcomm';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import {
  PeerDIDResolver,
  ExampleDIDResolver,
  ExampleSecretsResolver,
} from 'did-resolver-lib';
import { ROUTING } from '../shared_data/message_types';
import { CLIENT_SECRETS } from '../secrets/client';
import { MEDIATOR_ENDPOINT } from '../shared_data/endpoints';
import { CONTENT_TYPE, FROM } from '../shared_data/constants';

export function buildMessage(mediator_did: string[], message: string): Message {
  const imsg: IMessage = {
    id: uuidv4(),
    typ: 'application/didcomm-plain+json',
    type: ROUTING,
    body: {},
    from: FROM,
    to: mediator_did,
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
  return new Message(imsg);
}

export async function forward_msg(
  recipient_did: string[],
  mediator_did: string[],
  message: string,
) {
  try {
    const msg = buildMessage(mediator_did, message);
    const packed_msg = await pack_encrypt(msg, recipient_did);
    if (!packed_msg) {
      throw new Error('Failed to pack and encrypt the message.');
    }
    const response = await sendRequest(packed_msg);
    return response;
  } catch (error) {
    console.error('Error in forward_msg:', error);
    throw error;
  }
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
    const packed_msg = await msg.pack_encrypted(
      to[0],
      FROM,
      null,
      did_resolver,
      secret_resolver,
      {
        forward: true,
      },
    );

    // let message = await wrap_in_forward.Message.wrap_in_forward(
    //   packed_msg[0],
    //   {},
    //   to[0],
    //   [], // routing did
    //   '',
    //   did_resolver,
    // );

    return packed_msg[0];
  } catch (error) {
    console.error('Error in pack_encrypt:', error);
    throw new Error(error as string);
  }
}

export async function sendRequest(packed_msg: string) {
  try {
    const response = await axios.post(MEDIATOR_ENDPOINT, packed_msg, {
      headers: {
        'Content-type': CONTENT_TYPE,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data || 'Request was successful!';
    } else {
      throw new Error(
        `Unexpected response status: ${response.status}, Response data: ${JSON.stringify(response.data)}`,
      );
    }
  } catch (error) {
    console.error('Error in sendRequest:', error);
    throw new Error(`Failed to send request: ${error}`);
  }
}
