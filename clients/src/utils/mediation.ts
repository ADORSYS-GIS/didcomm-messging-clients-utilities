import { IMessage, Message } from "didcomm";
import PeerDIDResolver from "./resolver";
import { DIDResolver, SecretsResolver } from "didcomm";
import ExampleSecretsResolver, { ExampleDIDResolver } from "./Example_resolver";
import { CLIENT_SECRETS} from "../secrets/client";
import { CLIENT_DIDDOC, MEDIATOR_DIDDOC } from "../diddoc/constants";
import { MEDIATE_REQUEST } from "../protocols/message_types";

// Declaring the routing did
let ROUTINGDID;
export default async function Mediation_Coordinaton(to: string[], recipient_did: string, action: string): Promise<string | undefined> {

  // First Step to Mediation Coordination
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

  const TO = "did:peer:2.Vz6Mkf6r1uMJwoRAbzkuyj2RwPusdZhWSPeEknnTcKv2C2EN7.Ez6LSgbP4b3y8HVWG6C73WF2zLbzjDAPXjc33P2VfnVVHE347.SeyJpZCI6IiNkaWRjb21tIiwicyI6eyJhIjpbImRpZGNvbW0vdjIiXSwiciI6W10sInVyaSI6Imh0dHA6Ly9hbGljZS1tZWRpYXRvci5jb20ifSwidCI6ImRtIn0";
const From = "did:key:z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM";

  const val: IMessage = {
    id: "example-1",
    typ: "application/didcomm-plain+json",
    type: "example/v1",
    body: "example-body",
    from: From,
    to: [TO],
    pthid: "example-parent-thread-1",
    "example-header-1": "example-header-1-value",
    "example-header-2": "example-header-2-value",
    created_time: 10000,
    expires_time: 20000,
    attachments: [],
  };

  const msg = new Message(val);

  let did_resolver: DIDResolver = new PeerDIDResolver();//new ExampleDIDResolver([CLIENT_DIDDOC, MEDIATOR_DIDDOC]);
  let secret_resolver: SecretsResolver = new ExampleSecretsResolver(CLIENT_SECRETS);

  try {
    const [packed_msg, _] = await msg.pack_encrypted(
      TO,
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

  /**
   * @function mediate_request
   * @description Build and pack a mediation request message,
   * and send it to the mediator. Unpack the response and return
   * the unpacked message.
   * @param {string[]} to - The recipient DID(s) of the message
   * @param {string} recipient_did - The recipient DID of the mediation request
   * @returns {Promise<Message>}
   */
export async function mediate_request(to: string[], recipient_did: string): Promise<Message> {

  let body = { "recipient_did": recipient_did }
  let type = MEDIATE_REQUEST;
  let did_resolver: DIDResolver = new PeerDIDResolver();
  let secret_resolver: SecretsResolver = new ExampleSecretsResolver([]);

  let packed_msg = await build_and_pack_msg(to, type, body);

  let data = fetch('https://927f-145-224-72-143.ngrok-free.app/', {
    method: 'GET',
    body: packed_msg,
    headers: {
      'Content-Type': 'application/didcomm-encrypted+json'
    },

  }).then(response => {
    const data = response.text()
    return data
  }
  ).catch(error => {
    console.log(error)
  })

  const [unpackedMsg, _] = await Message.unpack(
    await data as string,
    did_resolver,
    secret_resolver,
    {}
  )

  return unpackedMsg
}
export async function keylist_update(recipient_did: string, action: string, to: string[]) {

  let did_resolver: DIDResolver = new PeerDIDResolver();
  let secret_resolver: SecretsResolver = new ExampleSecretsResolver(CLIENT_SECRETS);

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
  const [unpackedMsg, _] = await Message.unpack(
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
  const [unpackedMsg, _] = await Message.unpack(
    await data,
    did_resolver,
    secret_resolver,
    {}
  )
  return unpackedMsg


}



















