# `examples/aws/s3`

1. apply
   `kubectl apply -f examples/aws/s3`
1. upload html file
   ```bash
   export BUCKET_NAME=crossplane-s3-test
   aws s3 cp examples/aws/s3/helloworld.html s3://$BUCKET_NAME/helloworld.html
   ```
