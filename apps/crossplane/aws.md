# aws

## Preparing AWS

### cli

1. aws cli が設定されている必要があります
   - [Named profiles for the AWS CLI](Named profiles for the AWS CLI)
1. Credential profile
   ```bash
   cat ~/.aws/credentials
   ```
1. Config profile
   ```bash
   cat ~/.aws/config
   ```

## Setup AWS ProviderConfig

https://crossplane.io/docs/v1.9/getting-started/install-configure.html#install-configuration-package-1

1. setup aws provider
   https://crossplane.io/docs/v1.9/getting-started/install-configure.html#install-configuration-package-1
1. confirm
   ```bash
   # provider secret
   kubectl get secrets -n=crossplane-system
   # aws provider config
   kubectl get providerconfigs.aws.crossplane.io
   ```

## ec2

1. create resources
   ```bash
   kubectl apply -f apps/crossplane/examples/aws/ec2/
   ```
1. cleanup
   ```bash
   kubectl delete -f apps/crossplane/examples/aws/ec2/
   ```
1. ssh
   ```bash
   ssh -i ${YOUR_PRIVATE_KEY} ec2-user@$(kubectl get instances.ec2.aws.crossplane.io gokken-crossplane-test-instance -o=json | jq -r ".status.atProvider.publicIpAddress")
   ```
