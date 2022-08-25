## Pre-requisites

- local kubernetes cluster
- `yarn`
- [crossplane cli](https://crossplane.io/docs/v1.9/getting-started/install-configure.html#install-crossplane-cli)

## Run

1. Pulumi preview
   ```shell
   yarn nx dev crossplane preview
   ```
1. Pulumi up
   ```shell
   yarn nx dev crossplane
   ```

## Create Providers

```bash
kubectl apply -f apps/crossplane/manifests/provider
# confirm all packages become healthy
watch kubectl get pkg
```
