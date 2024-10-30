

export const MEDIATOR_DIDDOC =
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/jws-2020/v1"
  ],
  "id": "did:peer:2.Vz6Mkf6r1uMJwoRAbzkuyj2RwPusdZhWSPeEknnTcKv2C2EN7.Ez6LSgbP4b3y8HVWG6C73WF2zLbzjDAPXjc33P2VfnVVHE347.SeyJpZCI6IiNkaWRjb21tIiwicyI6eyJhIjpbImRpZGNvbW0vdjIiXSwiciI6W10sInVyaSI6Imh0dHA6Ly9hbGljZS1tZWRpYXRvci5jb20ifSwidCI6ImRtIn0",
  "alsoKnownAs": [
    "did:peer:3zQmNVZUh4qgAxSWhpeGhJVW3HHHU7MZZbZbQ4Vc43madsSf"
  ],
  "verificationMethod": [
    {
      "id": "#key-1",
      "type": "JsonWebKey2020",
      "controller": "did:peer:2.Vz6Mkf6r1uMJwoRAbzkuyj2RwPusdZhWSPeEknnTcKv2C2EN7.Ez6LSgbP4b3y8HVWG6C73WF2zLbzjDAPXjc33P2VfnVVHE347.SeyJpZCI6IiNkaWRjb21tIiwicyI6eyJhIjpbImRpZGNvbW0vdjIiXSwiciI6W10sInVyaSI6Imh0dHA6Ly9hbGljZS1tZWRpYXRvci5jb20ifSwidCI6ImRtIn0",
      "publicKeyJwk": {
        "kty": "OKP",
        "crv": "Ed25519",
        "x": "CaDmpOjPAiMWfdzBcK2pLyJAER6xvdhDl2dro6BoilQ"
      }
    },
    {
      "id": "#key-2",
      "type": "JsonWebKey2020",
      "controller": "did:peer:2.Vz6Mkf6r1uMJwoRAbzkuyj2RwPusdZhWSPeEknnTcKv2C2EN7.Ez6LSgbP4b3y8HVWG6C73WF2zLbzjDAPXjc33P2VfnVVHE347.SeyJpZCI6IiNkaWRjb21tIiwicyI6eyJhIjpbImRpZGNvbW0vdjIiXSwiciI6W10sInVyaSI6Imh0dHA6Ly9hbGljZS1tZWRpYXRvci5jb20ifSwidCI6ImRtIn0",
      "publicKeyJwk": {
        "kty": "OKP",
        "crv": "X25519",
        "x": "SQ_7useLAjGf66XAwQWuBuSv9PdD_wB4TJQ6w38nFwQ"
      }
    }
  ],
  "authentication": [
    "#key-2",
  ],

  "keyAgreement": [
    "#key-2",
  ],
  "service": [
    {
      "id": "#didcomm",
      "type": "DIDCommMessaging",
      "serviceEndpoint": {
        "accept": [
          "didcomm/v2"
        ],
        "routingKeys": [],
        "uri": "http://alice-mediator.com/"
      }
    }
  ]
}

export const CLIENT_DIDDOC =
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    {
      "Ed25519VerificationKey2018": "https://w3id.org/security#Ed25519VerificationKey2018",
      "publicKeyJwk": {
        "@id": "https://w3id.org/security#publicKeyJwk",
        "@type": "@json"
      }
    }
  ],
  "id": "did:key:z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM",
  "verificationMethod": [
    {
      "id": "did:key:z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM#key-1",
      "type": "JsonWebKey2020",
      "controller": "did:key:z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM",
      "publicKeyJwk": {
        "kty": "OKP",
        "crv": "X25519",
        "x": "SQ_7useLAjGf66XAwQWuBuSv9PdD_wB4TJQ6w38nFwQ"
      }
    }
  ],
  "authentication": [
    "did:key:z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM#z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM"
  ],
  "assertionMethod": [
    "did:key:z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM#z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM"
  ],
  "keyAgreement": [
    "did:key:z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM#key-1",
  ],

  "service": [
    {
      "id": "#didcomm",
      "type": "DIDCommMessaging",
      "serviceEndpoint": {
        "accept": [
          "didcomm/v2"
        ],
        "routingKeys": [],
        "uri": "http://alice-mediator.com/"
      }
    }
  ]
}


