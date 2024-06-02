# cryptogator-payment-validator

A script designed to check crypto payments on the Ethereum blockchain.

## Technologies & Languages

- TypeScript
- Blockchain (Ethereum, Polygon)
- AWS ECR
- AWS Lambda
- CircleCI

## Running locally

Run the following command:

```
docker-compose up --build
```

## Running tests

Run the following command:

```
npm install
npm run test
```

## Production

1. Push your changes to any branch.
2. CircleCI will build and push the Docker image to AWS ECR
3. CircleCI will update the Lambda function that executes every few hours
