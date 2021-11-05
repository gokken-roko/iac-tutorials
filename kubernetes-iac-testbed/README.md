# kubernetes-iac-testbed

- [pulumi automation api](https://www.pulumi.com/docs/guides/automation-api)

## Pre-requisites

```
$ yarn
```

## pulumi

Install Pulumi CLI

https://www.pulumi.com/docs/reference/cli/

```console
$ export PULUMI_CONFIG_PASSPHRASE=password
```

## Usase

### ローカルなどのクラスタにリソースを作成する

実行するシェルで対象の Kubernetes クラスタのコンテキストを指定します。

```console
$ kubectl config use-context $YOUR_CONTEXT
$ yarn start
```

完了すると、任意のリソースを利用できるようになります。

```console
$ kubectl port-forward services/argo-cd-argocd-server 8080:80 -n=pulumi-argo
$ open https://localhost:8080
```

### Azure AKS クラスタの作成および、リソースを作成する

**初期設定が完了した Azure CLI ( az コマンド )の事前準備が必要です。**

作成する Kubernetes クラスタの情報を設定します。

Azure AKS を利用する準備をします

1. Pulumi から API を実行するには、アプリケーション登録が必要です。
   ClientID と ClientSecret を取得します。[ドキュメント](https://www.pulumi.com/registry/packages/azure-native/installation-configuration/)
   ```console
   $ export AZURE_CLIENT_ID=${クライアント ID}
   $ export AZURE_CLIENT_SECRET=${クライアント Secret}
   ```
1. VM に設定する公開鍵を指定します
   ```console
   $ export SSH_PUBLIC_KEY=${SSH 公開鍵}
   ```

AKS クラスタ作成を有効にします。( AKS クラスタに対してリソースが作成される用になります。 )

```
$ export KUBERNETES_PROVIDER=aks
```

実行します。

```console
$ yarn start
```

完了したら kubeconfig を取得して、任意のリソースを利用できるようになります。

```console
# 一旦 stack=dev と決め打ち
$ pulumi stack output kubeconfig --stack=dev > kubeconfig.yaml
$ kubectl port-forward services/argo-cd-argocd-server 8080:80 -n=pulumi-argo --kubeconfig=kubeconfig.yaml
$ open https://localhost:8080
```

## Cleanup

リソースを削除します。

```console
$ yarn start destroy
```
