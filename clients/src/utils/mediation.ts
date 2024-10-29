import { IMessage, Message } from "didcomm";
import { v4 as uuidv4 } from 'uuid';
import PeerDIDResolver from "./resolver";
import { DIDResolver, SecretsResolver } from "didcomm";
import ExampleSecretsResolver, { ExampleDIDResolver } from "./Example_resolver";

const From = '';
type routing_did = string;
export default async function Mediation_Coordinaton(to: string[], recipient_did: string, action: string): Promise<routing_did | undefined> {
    let mediation_response: Message = await mediate_request(to, recipient_did);
    let body = mediation_response.as_value().body;
    try {
        let routing_did: string = body["routing_did"];
        keylist_update(recipient_did, action, to)
        return routing_did
    } catch {
        Error("Mediation Deny")
    }

}

export async function build_and_pack_msg(to: string[], type: string, body: {}): Promise<string> {
    if (!to || to.length === 0) {
        throw new Error("to is empty"); 
    }

    const val: IMessage = {
        id: "example-1",
        typ: "application/didcomm-plain+json",
        type: "example/v1",
        body: "example-body",
        from: "did:example:4",
        to: ["did:example:1", "did:example:2", "did:example:3"],
        thid: "example-thread-1",
        pthid: "example-parent-thread-1",
        "example-header-1": "example-header-1-value",
        "example-header-2": "example-header-2-value",
        created_time: 10000,
        expires_time: 20000,
        attachments: [
          {
            data: {
              base64: "ZXhhbXBsZQ==",
            },
            id: "attachment1",
          },
          {
            data: {
              json: "example",
            },
            id: "attachment2",
          },
          {
            data: {
              json: "example",
            },
            id: "attachment3",
          },
        ],
      };
    
      const msg = new Message(val);
      
      const DIDDoc = {
        id: 'did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0',
        keyAgreement: ['#key-1'],
        authentication: ['#key-2'],
        verificationMethod: [
          {
            id: '#key-1',
            type: 'Multikey',
            controller:
              'did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0',
            publicKeyMultibase: 'zz6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b',
          },
          {
            id: '#key-2',
            type: 'Multikey',
            controller:
              'did:peer:2.Ez6LSqXj3dXG5zL9bd4rUB21kDg5K6mBb5nRVArPbcAU8mX6b.Vz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc.SeyJhIjpbImRpZGNvbW0vdjIiXSwiaWQiOiIjZGlkY29tbSIsInMiOiJodHRwOi8vYWxpY2UtbWVkaWF0b3IuY29tIiwidCI6ImRtIn0',
            publicKeyMultibase: 'zz6Mku5fqS5Gm9iZy9nZ67uL4gJYvMMV454tmXJerWHWvp7tc',
          },
        ],
        service: [
          {
            id: '#didcomm',
            type: 'DIDCommMessaging',
            serviceEndpoint: 'http://alice-mediator.com',
          },
        ],
      };
      

    let did_resolver: DIDResolver = new ExampleDIDResolver([DIDDoc])
    let secret_resolver: SecretsResolver = new ExampleSecretsResolver([]);

    try {
        const [packed_msg, packedMetadata] = await msg.pack_encrypted(
            to[0],
            From,
            null,
            did_resolver,
            secret_resolver,
            {
                forward: false
            }
        )
        return packed_msg
    } catch (error) {
        
        throw error;
    }
}

export async function mediate_request(to: string[], recipient_did: string): Promise<Message> {
    let body = { "recipient_did": recipient_did }
    let type = "https://didcomm.org/coordinate-mediation/2.0/mediate-request";
    let did_resolver: DIDResolver = new PeerDIDResolver();
    let secret_resolver: SecretsResolver = new ExampleSecretsResolver([]);

    let packed_msg = await build_and_pack_msg(to, type, body);

    let data = fetch('', {
        method: 'POST',
        body: packed_msg,
        headers: {
            'Content-Type': 'application-encrypted+json'
        },

    }).then(response => {
        const data = response.text()
        return data
    }
    )
    const [unpackedMsg, unpackedMetadata] = await Message.unpack(
        await data,
        did_resolver,
        secret_resolver,
        {}
    )
    return unpackedMsg
}
export async function keylist_update(recipient_did: string, action: string, to: string[]) {

    let did_resolver: DIDResolver = new PeerDIDResolver();
    let secret_resolver: SecretsResolver = new ExampleSecretsResolver([]);

    let type: string = "https://didcomm.org/coordinate-mediation/2.0/keylist-update";
    let body = {
        "updates": [
            {
                "recipient_did": recipient_did[0],
                "action": action
            }
        ]
    }

    let packed_msg = build_and_pack_msg(to, type, body);

    let data = fetch('', {
        method: 'POST',
        body: await packed_msg,
        headers: {
            'Content-Type': 'application-encrypted+json'
        },

    }).then(response => {
        const data = response.text()
        return data
    }
    )
    const [unpackedMsg, unpackedMetadata] = await Message.unpack(
        await data,
        did_resolver,
        secret_resolver,
        {}
    )
    return unpackedMsg

}

export async function keylist_query(recipient_did: string[], action: string, did: string) {

    let type = "https://didcomm.org/coordinate-mediation/2.0/keylist-query";
    let did_resolver: DIDResolver = new PeerDIDResolver();
    let secret_resolver: SecretsResolver = new ExampleSecretsResolver([]);

    let body = {}
    let packed_msg = build_and_pack_msg(recipient_did, type, body);
    let data = fetch('http://localhost:3000/mediate', {
        method: 'POST',
        body: await packed_msg,
        headers: {
            'Content-Type': 'application-encrypted+json'
        },

    }).then(response => {
        const data = response.text()
        return data
    }
    )
    const [unpackedMsg, unpackedMetadata] = await Message.unpack(
        await data,
        did_resolver,
        secret_resolver,
        {}
    )
    return unpackedMsg


}



















