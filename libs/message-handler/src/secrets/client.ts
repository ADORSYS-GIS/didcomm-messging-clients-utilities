import { Secret } from 'didcomm';
import { FROM } from '../shared_data/constants';

export const CLIENT_SECRETS: Secret[] = [
  {
    id: `${FROM}#key-1`,
    type: 'JsonWebKey2020',
    privateKeyJwk: {
      crv: 'Ed25519',
      d: 'vp0WuZNeCsoXYj94738e0gwi_PLF7VIutNCrFVNx--0',
      kty: 'OKP',
      x: 'CaDmpOjPAiMWfdzBcK2pLyJAER6xvdhDl2dro6BoilQ',
    },
  },
  {
    id: `${FROM}#key-2`,
    type: 'JsonWebKey2020',
    privateKeyJwk: {
      crv: 'X25519',
      d: 'kxUXT-2TOa6F6xk2ojQgJlT3xWq0aCA9j-BW4VB5_A8',
      kty: 'OKP',
      x: 'SQ_7useLAjGf66XAwQWuBuSv9PdD_wB4TJQ6w38nFwQ',
    },
  },
];
