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

## Setup crossplane with yarn

[README.md](./README.md)

## Setup AWS ProviderConfig

https://crossplane.io/docs/v1.9/getting-started/install-configure.html#install-configuration-package-1

1. Get AWS Account Keyfile
   https://crossplane.io/docs/v1.9/getting-started/install-configure.html#install-configuration-package-1
   ```bash
   cat creds.conf
   ```
1. setup aws provider
   https://crossplane.io/docs/v1.9/getting-started/install-configure.html#install-configuration-package-1
   ```bass
   kubectl create secret generic aws-creds -n crossplane-system --from-file=creds=./creds.conf
   ```
1. Confirm secrets
   ```bash
   kubectl get secrets -n=crossplane-system
   ```
1. Configure the provider
   ```bash
   cat <<EOF | kubectl apply -f -
   apiVersion: aws.crossplane.io/v1beta1
   kind: ProviderConfig
   metadata:
     name: default-aws
   spec:
     credentials:
       source: Secret
       secretRef:
         namespace: crossplane-system
         name: aws-creds
         key: creds
   EOF
   ```
1. Confirm `default-aws` provider
   ```bash
   kubectl get providerconfigs.aws.crossplane.io
   ```

## Example | create ec2 instance

1. create resources
   ```bash
   kubectl apply -f apps/crossplane/examples/aws/ec2/
   ```
1. ssh to ec2 instance
   ```bash
   ssh -i ${YOUR_PRIVATE_KEY} ec2-user@$(kubectl get instances.ec2.aws.crossplane.io gokken-crossplane-test-instance -o=json | jq -r ".status.atProvider.publicIpAddress")
   ```
1. cleanup
   ```bash
   kubectl delete -f apps/crossplane/examples/aws/ec2/
   ```
