import { DIDDoc, IMessage, Message } from "didcomm";
import PeerDIDResolver from "./resolver";
import { DIDResolver, SecretsResolver } from "didcomm";
import ExampleSecretsResolver, { ExampleDIDResolver } from "./Example_resolver";
import { CLIENT_SECRETS } from "../secrets/client";
import { MEDIATE_REQUEST } from "../protocols/message_types";
import { FROM } from "../shared_data/constants";
import { Fragment } from "react/jsx-runtime";


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

  const val: IMessage = {
    id: "uuid",
    typ: "application/didcomm-plain+json",
    type: "example/v1",
    body: "example-body",
    from: FROM,
    to: to,
    pthid: "example-parent-thread-1",
    "example-header-1": "example-header-1-value",
    "example-header-2": "example-header-2-value",
    created_time: 10000,
    expires_time: 20000,
    attachments: [],
  };

  const msg = new Message(val);
  let CLIENT_DIDDOC: DIDDoc | null = await new PeerDIDResolver().resolve(FROM);
  let MEDIATOR_DIDDOC: DIDDoc | null = await new PeerDIDResolver().resolve(to[0]);

  let did_resolver: DIDResolver = new ExampleDIDResolver([CLIENT_DIDDOC as DIDDoc, MEDIATOR_DIDDOC as DIDDoc]);
  let secret_resolver: SecretsResolver = new ExampleSecretsResolver(CLIENT_SECRETS);

  try {
    const [packed_msg, _] = await msg.pack_encrypted(
      to[0],
      FROM,
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

  let body = {}
  let type = MEDIATE_REQUEST;

  let DIDDoc = await new PeerDIDResolver().resolve(to[0]);
  let did_resolver: DIDResolver = new ExampleDIDResolver([DIDDoc as DIDDoc]);
  let secret_resolver: SecretsResolver = new ExampleSecretsResolver(CLIENT_SECRETS);

  let packed_msg = await build_and_pack_msg(to, type, body);

  let data = fetch('https://927f-145-224-72-143.ngrok-free.app/', {
    method: 'POST',
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



















