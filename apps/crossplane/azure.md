# Azure

## Preparing Azure Account

https://crossplane.io/docs/v1.9/cloud-providers/azure/azure-provider.html#preparing-your-microsoft-azure-account


### Create Azure app

1. アプリの登録をします
   - https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps
1. アプリから `アプリケーション ID の URI` を取得します
   - `api://xxx...`

### Configure Azure app permission

1. login
   ```bash
   az login
   ```
1. create service principal with Owner role
   ```bash
   az ad sp create-for-rbac --sdk-auth --role Owner --name ${アプリケーション ID の URI e.g. api://..} > crossplane-azure-provider-key.json
   ```
1. Azure Client ID を設定します
   ```bash
   # e.g. $ cat crossplane-azure-provider-key.json | grep clientId
   export AZURE_CLIENT_ID=<clientId value from json file> 
   ```
1. App に適切な Permission を設定します
   [Azure のドキュメント](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-access-web-apis)を参照して GUI 上で設定する。
   もしくは、
   [Crossplane のドキュメント](https://crossplane.io/docs/v1.9/cloud-providers/azure/azure-provider.html#preparing-your-microsoft-azure-account) を参照して Cli で設定します

### Setup Azure ProviderConfig

https://crossplane.io/docs/v1.9/cloud-providers/azure/azure-provider.html#preparing-your-microsoft-azure-account

1. Install provider
   ```bash
   kubectl crossplane install provider crossplane/provider-azure:v0.19.0
   # wait until healthy
   watch kubectl get pkg
   ```
1. Kubernetes 用の Credential を作成します
   ```bash
   BASE64ENCODED_AZURE_ACCOUNT_CREDS=$(base64 crossplane-azure-provider-key.json | tr -d "\n")
   ```
1. Kubernetes リソースを作成します
   [Crossplane のドキュメント](https://crossplane.io/docs/v1.9/cloud-providers/azure/azure-provider.html#setup-azure-providerconfig)を参照して、リソースを作成してください。
1. 確認します
   ```bash
   kubectl get TODO
   ```
