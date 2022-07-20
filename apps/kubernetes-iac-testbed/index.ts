import { InlineProgramArgs, LocalWorkspace } from "@pulumi/pulumi/automation";
import { Provider } from "@pulumi/kubernetes";
import { Aks } from "./src/aks";
import { Argo } from "./src/argo";

import process = require("process");
import { Output } from "@pulumi/pulumi/output";

// TODO: kubernetes.provider をきちんとするか考える
// https://www.pulumi.com/registry/packages/kubernetes/api-docs/provider/

// アプリケーションをデプロイする kubernetes クラスタを指定します
//
// - ""    : 実行している ternimanl の context が使われます
// - "aks" : aks クラスタを利用します
const kubernetesProvider = process.env.KUBERNETES_PROVIDER || "";

const args = process.argv.slice(2);
let destroy = false;
if (args.length > 0 && args[0]) {
  destroy = args[0] === "destroy";
}

const run = async () => {
  var provider: Provider | undefined = undefined;
  var kubeconfig: Output<string> | undefined = undefined;

  const pulumiProgram = async () => {
    if (kubernetesProvider === "aks") {
      console.info("Kubernetes provider:", kubernetesProvider);

      // https://github.com/pulumi/examples/blob/master/azure-ts-aks-helm/config.ts
      const aks = new Aks("aks", {
        k8sVersion: "1.20.9",
        clientID: process.env.AZURE_CLIENT_ID || "",
        clientSecret: process.env.AZURE_CLIENT_SECRET || "",
        sshPublicKey: process.env.SSH_PUBLIC_KEY || "",
        adminUserName: "azureuser",
        nodeCount: 2,
        nodeSize: "Standard_B2s",
      });
      provider = aks.provider;
      kubeconfig = aks.kubeconfig;
    }

    const argo = new Argo(
      "Argo",
      {
        namespace: "pulumi-argo",
      },
      {
        provider: provider,
      }
    );

    return {
      argoUrl: argo.helmUrn,
      kubeconfig: kubeconfig,
    };
  };

  // Create our stack
  const args: InlineProgramArgs = {
    stackName: "dev",
    projectName: "kubernetes-iac-testbed",
    program: pulumiProgram,
  };

  // create (or select if one already exists) a stack that uses our inline program
  const stack = await LocalWorkspace.createOrSelectStack(args);

  // For Azure
  // TODO: Read from config or environment variable...
  await stack.workspace.installPlugin("azure-native", "v1.42.0");
  await stack.setConfig("azure-native:location", { value: "westus" });

  console.info("successfully initialized stack");
  console.info("refreshing stack...");
  await stack.refresh({ onOutput: console.info });
  console.info("refresh complete");

  if (destroy) {
    console.info("destroying stack...");
    await stack.destroy({ onOutput: console.info });
    console.info("stack destroy complete");
    process.exit(0);
  }

  console.info("updating stack...");
  const upRes = await stack.up({ onOutput: console.info });
  console.log(
    `update summary: \n${JSON.stringify(
      upRes.summary.resourceChanges,
      null,
      4
    )}`
  );
  //console.log(`website url: ${upRes.outputs.websiteUrl.value}`);
};

run().catch((err) => console.log(err));
