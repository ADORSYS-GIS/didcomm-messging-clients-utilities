import { DIDDoc, DIDResolver, IMessage, Message, SecretsResolver } from 'didcomm';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import PeerDIDResolver from '../../../did-resolver-lib/src/resolver';
import { ExampleDIDResolver, ExampleSecretsResolver } from '../../../did-resolver-lib/src/ExampleDIDResolver';
import { FROM } from '../did_doc/client';
import { ROUTING } from '../shared_data/message_types';
import { CLIENT_SECRETS } from '../secrets/client';
import { MEDIATOR_ENDPOINT } from '../shared_data/endpoints';
import { CONTENT_TYPE } from '../shared_data/constant';



export async function forward_msg(to: string[], body: {}, message: string) {

  const mediator_didoc = await new PeerDIDResolver().resolve(to[0]);

  console.log("Mediator DID doc: ", mediator_didoc);
  const did_resolver: DIDResolver = new ExampleDIDResolver([mediator_didoc as DIDDoc]);
  const secret_resolver: SecretsResolver = new ExampleSecretsResolver(CLIENT_SECRETS);

  const val: IMessage = {
    id: uuidv4(),
    typ: "application/didcomm-plain+json",
    type: ROUTING,
    body: body,
    from: FROM,
    to: to,
    attachments: [
      {
        data: {
          json: { data: message },
        },
        id: uuidv4(),
        description: "example",
        media_type: "application/didcomm-encrypted+json",
      },
    ],
  };

  const msg = new Message(val);

  try {
    const [packed_msg, _packedMetadata] = await msg.pack_encrypted(
      to[0],
      FROM,
      null,
      did_resolver,
      secret_resolver,
      {
        forward: true,
      },
    );
    
    let response = await axios.post(
      MEDIATOR_ENDPOINT,
      packed_msg,
      {
        headers: {
          'Content-type': CONTENT_TYPE,
        },
      },
    );
    console.log('Message forwared successfully:', response.status);

    return 'Messages sent to recipient';
  } catch (error: any) {
    console.error('Error forwarding message:', error);
    throw new Error(error);
  }

}
