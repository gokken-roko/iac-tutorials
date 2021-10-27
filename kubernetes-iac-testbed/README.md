# kubernetes-iac-testbed

- [pulumi automation api](https://www.pulumi.com/docs/guides/automation-api)

## Pre-requisites

kubernetes クラスタの準備 または az コマンドの準備

```
$ yarn
```

## pulumi

Install Pulumi CLI

https://www.pulumi.com/docs/reference/cli/

```console
$ export PULUMI_CONFIG_PASSPHRASE=password
```

## Run

```console
$ kubectl config use-context $YOUR_CONTEXT
$ yarn start
```

```console
$ kubectl port-forward services/argo-cd-argocd-server 8080:80 -n=pulumi-argo
$ open https://localhost:8080
```

## Cleanup

```console
$ yarn start destroy
```
