import { DIDResolver, Message, SecretsResolver } from 'didcomm';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import PeerDIDResolver from '../../did-resolver-lib/src/resolver';
import { ExampleSecretsResolver } from '../../did-resolver-lib/src/ExampleDIDResolver';

const FROM = '';
let did_resolver: DIDResolver = new PeerDIDResolver();
let secret_resolver: SecretsResolver = new ExampleSecretsResolver([]);

export async function forward_msg(to: string[], body: {}): Promise<string> {
  const msg = new Message({
    id: uuidv4(),
    typ: 'application/didcomm-plain+json',
    type: 'https://didcomm.org/routing/2.0/forward',
    from: FROM,
    to: to,
    body: body,
  });

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
      'https://mediator-endpoint.com',
      packed_msg,
      {
        headers: {
          'Content-type': 'application/didcomm-plain+json',
        },
      },
    );
    console.log('Message forwared successfully:', response.status);
  } catch (error: any) {
    Error(error);
  }
  return 'Messages sent to recipient';
}
