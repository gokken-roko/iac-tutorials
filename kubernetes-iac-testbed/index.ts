import { InlineProgramArgs, LocalWorkspace } from "@pulumi/pulumi/automation";
import { Argo } from "./src/argo";

import process = require('process');

const args = process.argv.slice(2);
let destroy = false;
if (args.length > 0 && args[0]) {
    destroy = args[0] === "destroy";
}

const run = async () => {
    // This is our pulumi program in "inline function" form
    const pulumiProgram = async () => {
        const argo = new Argo("Argo", {
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
    //console.info("installing plugins...");
    //await stack.workspace.installPlugin("aws", "v4.0.0");
    //console.info("plugins installed");
    //console.info("setting up config");
    //await stack.setConfig("aws:region", { value: "us-west-2" });
    //console.info("config set");
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
    console.log(`website url: ${upRes.outputs.websiteUrl.value}`);
};

run().catch(err => console.log(err));
