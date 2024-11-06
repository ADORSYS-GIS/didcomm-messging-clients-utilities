import { DIDDoc, IMessage, Message } from "didcomm";
import PeerDIDResolver from '../../did-resolver-lib/src/resolver';
import { DIDResolver, SecretsResolver } from "didcomm";
import ExampleSecretsResolver, { ExampleDIDResolver } from "../../did-resolver-lib/src/ExampleDIDResolver";
import { CLIENT_SECRETS } from "./secrets/client";
import { KEYLIST_QUERY, KEYLIST_UPDATE, MEDIATE_REQUEST } from "./protocols/message_types";
import { CONTENT_TYPE, FROM, SERVICE_ENDPOINT } from "./shared_data/constants";

/**
 * @function Mediation_Coordinaton
 * @description Coordinates the mediation process by sending a mediation request and updating the keylist based on the response.
 * @param {string[]} to - The recipient DID(s) of the message
 * @param {string} recipient_did - The recipient DID of the mediation request
 * @param {string} action - The action to be taken for the keylist update
 * @returns {Promise<string | undefined>} - Returns the routing DID if successful, or undefined if mediation is denied
 */
export default async function Mediation_Coordinaton(to: string[], recipient_did: string, action: string): Promise<string | undefined> {

    // Send a mediation request and receive the response
    const mediation_response = await mediate_request(to, recipient_did);

    // Extract the body from the mediation response
    const { body } = mediation_response.as_value();
    
    // Retrieve the routing DID from the response body
    const routing_did = body?.routing_did;

    // Update the keylist with the provided action and recipient DID
    if (routing_did) {
        keylist_update(recipient_did, action, to);
        return routing_did;
    }
    
    // Handle error if mediation is denied
    throw new Error("Mediation Deny");
}

export async function build_and_pack_msg(to: string[], type: string, body: {}): Promise<string> {
    if (!to || to.length === 0) {
        throw new Error("to is empty");
    }

    const val: IMessage = {
        id: "uuid",
        typ: "application/didcomm-plain+json",
        type: type,
        body: body,
        from: FROM,
        to: to
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

    let body = { "recipient_did": recipient_did }
    let type = MEDIATE_REQUEST;

    let DIDDoc = await new PeerDIDResolver().resolve(to[0]);
    let did_resolver: DIDResolver = new ExampleDIDResolver([DIDDoc as DIDDoc]);
    let secret_resolver: SecretsResolver = new ExampleSecretsResolver(CLIENT_SECRETS);

    let packed_msg = await build_and_pack_msg(to, type, JSON.stringify(body));

    let data = fetch(SERVICE_ENDPOINT, {
        method: 'POST',
        body: packed_msg,
        headers: {
            'Content-Type': CONTENT_TYPE
        },

    }).then(response => {
        const data = response.text()
        return data
    }
    ).catch(error => {
        throw Error(error)
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

    let DIDDoc = await new PeerDIDResolver().resolve(to[0]);
    let did_resolver: DIDResolver = new ExampleDIDResolver([DIDDoc as DIDDoc]);
    let secret_resolver: SecretsResolver = new ExampleSecretsResolver(CLIENT_SECRETS);
    let body = {
        "updates": [
            {
                "recipient_did": recipient_did[0],
                "action": action
            }
        ]
    }

    let packed_msg = build_and_pack_msg(to, KEYLIST_UPDATE, JSON.stringify(body));

    let data = fetch(SERVICE_ENDPOINT, {
        method: 'POST',
        body: await packed_msg,
        headers: {
            'Content-Type': CONTENT_TYPE
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

export async function keylist_query(to: string, recipient_did: string[]) {

    let DIDDoc = await new PeerDIDResolver().resolve(to[0]);
    let did_resolver: DIDResolver = new ExampleDIDResolver([DIDDoc as DIDDoc]);
    let secret_resolver: SecretsResolver = new ExampleSecretsResolver(CLIENT_SECRETS);

    let body = {}
    let packed_msg = build_and_pack_msg(recipient_did, KEYLIST_QUERY, JSON.stringify(body));
    let data = fetch(SERVICE_ENDPOINT, {
        method: 'POST',
        body: await packed_msg,
        headers: {
            'Content-Type': CONTENT_TYPE
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


















