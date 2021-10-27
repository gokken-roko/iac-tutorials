import { InlineProgramArgs, LocalWorkspace } from "@pulumi/pulumi/automation";
import { Provider } from "@pulumi/kubernetes";
import { Argo } from "./src/argo";

import process = require('process');

// TODO: kubernetes.provider をきちんとするか考える
// https://www.pulumi.com/registry/packages/kubernetes/api-docs/provider/

// アプリケーションをデプロイする kubernetes クラスタを指定します
//
// - ""    : 実行している ternimanl の context が使われます
// - TODO : "aks" : aks クラスタを利用します
const kubernetesProvider = process.env.KUBERNETES_PROVIDER || ""

const args = process.argv.slice(2);
let destroy = false;
if (args.length > 0 && args[0]) {
    destroy = args[0] === "destroy";
}

const run = async () => {
    var provider: Provider | undefined = undefined

    if (kubernetesProvider == "aks") {
        console.info("Kubernetes provider:", kubernetesProvider)
    }

    const pulumiProgram = async () => {
        const argo = new Argo("Argo", {
            provider: provider,
            namespace: "pulumi-argo"
        })

        return {
            argoUrl: argo.helmUrn,
        }
    };

    // Create our stack
    const args: InlineProgramArgs = {
        stackName: "dev",
        projectName: "kubernetes-iac-testbed",
        program: pulumiProgram
    };

    // create (or select if one already exists) a stack that uses our inline program
    const stack = await LocalWorkspace.createOrSelectStack(args);

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
    console.log(`update summary: \n${JSON.stringify(upRes.summary.resourceChanges, null, 4)}`);
    //console.log(`website url: ${upRes.outputs.websiteUrl.value}`);
};

run().catch(err => console.log(err));
