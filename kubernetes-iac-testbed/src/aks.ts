import * as containerservice from "@pulumi/azure-native/containerservice";
import * as resources from "@pulumi/azure-native/resources";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

interface aksProps {
    k8sVersion: string,
    clientID: string,
    clientSecret: string,
    sshPublicKey: string,
    adminUserName: string,
    nodeCount: number,
    nodeSize: string,
}

// https://github.com/pulumi/examples/blob/master/azure-ts-aks-helm
export class Aks extends pulumi.ComponentResource {
  public kubeconfig: pulumi.Output<string>
  public provider: k8s.Provider

  constructor (
      name: string,
      props: aksProps,
      opts?: pulumi.ComponentResourceOptions
  ){
    super("azure:aks:test", name, {}, opts);

    const resourceGroup = new resources.ResourceGroup("test-rg");
    // https://www.pulumi.com/registry/packages/azure-native/api-docs/containerservice/managedcluster/
    const k8sCluster = new containerservice.ManagedCluster("cluster", {
        resourceGroupName: resourceGroup.name,
        addonProfiles: {
            KubeDashboard: {
                enabled: false,
            },
        },
        agentPoolProfiles: [{
            count: props.nodeCount,
            maxPods: 110,
            mode: "System",
            name: "agentpool",
            nodeLabels: {},
            osDiskSizeGB: 30,
            osType: "Linux",
            type: "VirtualMachineScaleSets",
            vmSize: props.nodeSize,
        }],
        dnsPrefix: resourceGroup.name,
        enableRBAC: true,
        kubernetesVersion: props.k8sVersion,
        linuxProfile: {
            adminUsername: props.adminUserName,
            ssh: {
                publicKeys: [{
                    keyData: props.sshPublicKey,
                }],
            },
        },
        nodeResourceGroup: "node-resource-group",
        servicePrincipalProfile: {
            // https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/Overview/appId/587daa33-30d3-41e8-8360-b0c865847f43/objectId/1344cdab-cd09-4443-87b3-f8b4f47e41ef/isMSAApp//defaultBlade/Overview/appSignInAudience/AzureADMyOrg/servicePrincipalCreated/true
            clientId: props.clientID,
            secret: props.clientSecret,
        },
    });

    const creds = pulumi.all([k8sCluster.name, resourceGroup.name]).apply(([clusterName, rgName]) => {
        return containerservice.listManagedClusterUserCredentials({
            resourceGroupName: rgName,
            resourceName: clusterName,
        });
    });

    this.kubeconfig =
        creds.kubeconfigs[0].value
        .apply(enc => Buffer.from(enc, "base64").toString());
    this.provider = new k8s.Provider("k8s-provider", {
        kubeconfig: this.kubeconfig,
    });
    this.registerOutputs(this.kubeconfig);
  }
}
