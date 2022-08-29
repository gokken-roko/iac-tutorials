import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import * as path from "path";

export class Crossplane extends pulumi.ComponentResource {
  public helmUrn: pulumi.Output<string>;

  constructor(name: string, opts?: pulumi.ComponentResourceOptions) {
    super("kubernetes:helm:crossplane", name, {}, opts);
    const options = { parent: this };

    const namespace = "crossplane-system";

    const crossplaneChart = new k8s.helm.v3.Release(
      "crossplane-chart",
      {
        chart: "crossplane",
        version: "1.9.0",
        namespace: namespace,
        createNamespace: true,
        repositoryOpts: {
          repo: "https://charts.crossplane.io/stable",
        },
        values: {
          replics: 1,
        },
      },
      {
        ...options,
      }
    );

    new k8s.yaml.ConfigGroup(
      "provider",
      {
        files: path.join(__dirname, "manifests/crossplane-provider/*.yaml"),
      },
      {
        dependsOn: crossplaneChart,
        ...options,
      }
    );

    this.helmUrn = crossplaneChart.urn;
    this.registerOutputs();
  }
}
