import { DIDDoc, DIDResolver, Service, VerificationMethod } from 'didcomm';
import base64url from 'base64url';
import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

type Purpose =
  | 'Assertion'
  | 'Encryption'
  | 'Verification'
  | 'CapabilityDelegation'
  | 'CapabilityInvocation'
  | 'Service';

export default class PeerDIDResolver implements DIDResolver {
  async resolve(did: string): Promise<DIDDoc | null> {
    try {
      // Validate if the DID starts with the "did:peer:" prefix
      if (!did.startsWith('did:peer:')) {
        throw new Error('Unsupported DID method');
      } else if (!did.startsWith('did:peer:2')) {
        Error('Unsupported DID peer Version');
      }

      // Dissect the DID address
      const chain = did
        .replace(/^did:peer:2\./, '')
        .split('.')
        .map((e) => {
          const purposeCode = e.charAt(0);
          const purpose = mapPurposeFromCode(purposeCode);
          const multikey = e.slice(1);
          return { purpose, multikey };
        });

      const authentication: string[] = [];
      const keyAgreement: string[] = [];
      const assertionMethod: string[] = [];
      const verificationMethods: VerificationMethod[] = [];

      chain
        .filter(({ purpose }) => purpose !== 'Service')
        .forEach((item, index) => {
          const id = `${did}#key-${index + 1}`;
          const { purpose, multikey } = item;

          let type: string;
          switch (purpose) {
            case 'Assertion':
              type = 'Multikey';
              assertionMethod.push(id);
              break;
            case 'Verification':
              type = 'Ed25519VerificationKey2020';
              authentication.push(id);
              break;
            case 'Encryption':
              type = 'X25519KeyAgreementKey2020';
              keyAgreement.push(id);
              break;
            default:
              type = 'Multikey';
          }

          const method: VerificationMethod = {
            id,
            type,
            controller: did,
            publicKeyMultibase: `${multikey}`,
          };

          verificationMethods.push(method);
        });

      // Resolve services
      const services: Service[] = [];
      let serviceNextId = 0;

      chain
        .filter(({ purpose }) => purpose === 'Service')
        .forEach(({ multikey }) => {
          const decodedService = base64url.decode(multikey);
          const service = reverseAbbreviateService(decodedService);

          if (!service.id) {
            service.id =
              serviceNextId === 0 ? '#service' : `#service-${serviceNextId}`;
            serviceNextId++;
          }

          services.push(service);
        });

      const diddoc: DIDDoc = {
        id: did,
        keyAgreement,
        authentication,
        verificationMethod: verificationMethods,
        service: services,
      };

      return diddoc;
    } catch (error: string | unknown) {
      Error(error as string);
      return null;
    }
  }
}

function reverseAbbreviateService(decodedService: string): Service {
  const parsed = JSON.parse(decodedService);
  return {
    id: parsed.id || '',
    type: 'DIDCommMessaging',
    serviceEndpoint: parsed.s,
  };
}

function mapPurposeFromCode(code: string): Purpose {
  switch (code) {
    case 'A':
      return 'Assertion';
    case 'E':
      return 'Encryption';
    case 'V':
      return 'Verification';
    case 'D':
      return 'CapabilityDelegation';
    case 'I':
      return 'CapabilityInvocation';
    case 'S':
      return 'Service';
    default:
      throw new Error('Invalid purpose prefix');
  }
}
