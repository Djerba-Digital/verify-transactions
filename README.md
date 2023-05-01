
# Verify Transactions

Djerba digital has made it easy for developers to stream data to create microservices, generate reports or whatever they find useful from this data stream. In our use case, we will consume messages with KafkaJs and verify transactions as they are correct.


## Documentation

Check our [Documentation](https://documenter.getpostman.com/view/21075903/2s93eSZFY9) to fetch company ID.


## Environment Variables

To run this project, you will need to add the following environment variables to your "env/config.env" file

**Create test api keys and secret [api keys and secrets](https://www.djerba.digital/developers/#test_key) to test these features.**


`KAFKA_BROKERS=pkc-3w22w.us-central1.gcp.confluent.cloud:9092`

`KAFKA_KEY=*************************`

`KAFKA_SECRET=*************************`

`TOPIC=company-{{company_id}}-test`

`GROUP_ID=company-{{company_id}}-verify-message`

`DD_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArBLmLDda2qjSfGPwUOFj
cz5jcQofEosBPvmTPH1NH0fbwMxOhhhpHTLgRMkwqLBAuo2I/uvF2ofE6of2+ba5
qzBHO8J51lRHg5+h7DFQgWDEcum7rz21h7/of17eM5a9cioiK6sQMRic9Dm7+Yju
AriYOPXBgatpmFKu7cvleLLl/xqsiXi86wqBBXOcO3NLnIue0xLMUZ6alYq4axLH
FdfFlyc3BXLl3FxYqT5F25OIOsal12iTxkV1O1fUf7PnVrPzGYjJCNkzrDtxWks0
xlGGB7WMW0OaH1y3eaOjsu/qbzMY/JTPkosdcDSvSfz/0h331u0Bx7TyohINXJzw
JwIDAQAB
-----END PUBLIC KEY-----
"`

`MONGO_URI=*************************`

## Init code
Run `node index.js` in terminal.
