// AWS CDK
import {
  Arn,
  Stack,
} from 'aws-cdk-lib';

// AWS CDK - Custom Resources
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
  PhysicalResourceIdReference,
} from 'aws-cdk-lib/custom-resources';

// Constructs
import { Construct } from 'constructs';

/**
 * Certificate Construct Properties
 */
export interface CertificateProps {
  /**
   * Specifies whether the certificate is active.
   */
  readonly setAsActive?: boolean;
}

/**
 * Certificate Construct
 */
export class Certificate extends Construct {
  /**
   * The ARN of the certificate.
   */
  public readonly arn: string;

  /**
   * The ID of the certificate.
   */
  public readonly id: string;

  /**
   * The certificate data, in PEM format.
   */
  public readonly pem: string;

  /**
   * The private key.
   */
  public readonly privateKey: string;

  /**
   * The public key.
   */
  public readonly publicKey: string;

  /**
   * Create a new certificate.
   */
  constructor(scope: Construct, id: string, props: CertificateProps) {
    super(scope, id);

    // Define the policy for custom resource SDK calls.
    const policy = AwsCustomResourcePolicy.fromSdkCalls({
      resources: AwsCustomResourcePolicy.ANY_RESOURCE,
    });

    // Create a custom resource to generate keys and a certificate.
    const createKeysAndCertificate = new AwsCustomResource(this, 'CreateKeysAndCertificate', {
      onUpdate: {
        service: 'iot',
        action: 'CreateKeysAndCertificate',
        physicalResourceId: PhysicalResourceId.fromResponse('certificateId'),
        outputPaths: [
          'certificateId',
          'certificatePem',
          'keyPair.PrivateKey',
          'keyPair.PublicKey',
        ],
      },
      onDelete: {
        service: 'iot',
        action: 'DeleteCertificate',
        parameters: {
          certificateId: new PhysicalResourceIdReference(),
        },
      },
      policy,
      installLatestAwsSdk: false,
    });

    // Retrieve the certificate and key details from the custom resource response.
    const [certificateId, certificatePem, privateKey, publicKey] = [
      createKeysAndCertificate.getResponseField('certificateId'),
      createKeysAndCertificate.getResponseField('certificatePem'),
      createKeysAndCertificate.getResponseField('keyPair.PrivateKey'),
      createKeysAndCertificate.getResponseField('keyPair.PublicKey'),
    ];

    // Create the certificate ARN.
    const certificateArn = Arn.format({
      service: 'iot',
      resource: 'cert',
      resourceName: certificateId,
    }, Stack.of(this));

    // If the setAsActive property is true, update the certificate status to ACTIVE.
    if (props.setAsActive) {
      new AwsCustomResource(this, 'UpdateCertificate', {
        onUpdate: {
          service: 'iot',
          action: 'UpdateCertificate',
          parameters: {
            certificateId,
            newStatus: 'ACTIVE',
          },
          physicalResourceId: PhysicalResourceId.of(certificateId),
        },
        onDelete: {
          service: 'iot',
          action: 'UpdateCertificate',
          parameters: {
            certificateId,
            newStatus: 'INACTIVE',
          },
        },
        policy,
        installLatestAwsSdk: false,
      });
    }

    // Assign the retrieved values to the class properties.
    this.arn = certificateArn;
    this.id = certificateId;
    this.pem = certificatePem;
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }
}
