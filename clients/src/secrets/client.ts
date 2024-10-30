import { Secret } from "didcomm";

export const CLIENT_SECRETS: Secret[] = [
  {
    id: "did:key:z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM",
    type: "JsonWebKey2020",
    privateKeyJwk: {
      crv: "Ed25519",
      d: "vp0WuZNeCsoXYj94738e0gwi_PLF7VIutNCrFVNx--0",
      kty: "OKP",
      x: "CaDmpOjPAiMWfdzBcK2pLyJAER6xvdhDl2dro6BoilQ",
    },
  },
  {
    id: "did:key:z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM#key-1",
    type: "JsonWebKey2020",
    privateKeyJwk: {
      crv: "X25519",
      d: "kxUXT-2TOa6F6xk2ojQgJlT3xWq0aCA9j-BW4VB5_A8",
      kty: "OKP",
      x: "SQ_7useLAjGf66XAwQWuBuSv9PdD_wB4TJQ6w38nFwQ",
    },
  }
];

// export const SECRETS: Secret =
// {
//   id: "did:key:z6MkrQT3VKYGkbPaYuJeBv31gNgpmVtRWP5yTocLDBgPpayM#key-1",
//   type: "JsonWebKey2020",
//   privateKeyJwk: {
//     crv: "Ed25519",
//     d: "kUKFMD3RCZpk556fG0hx9GUrmdvb8t7k3TktPXCi4CY",
//     kty: "OKP",
//     x: "sZPvulKOXCES3D8Eya3LVnlgOpEaBohCqZ7emD8VXAA",
//   },
// }
