# Netlify Preview Service

Since Github Actions only provide a zipped artifact and it's sometimes annoying since there is only ONE file inside that zip file. It makes users harder to preview the artifact.

This service is designed for [OI-Wiki](https://github.com/OI-wiki/OI-wiki) project. It can help accelerate the review process for collaborators, since the only file in the workflow artifact is one single PDF file.

The service will respond with an direct download link of the extracted file after receiving a POST request with an `artifact_id` payload.

## Environment

node v18.17.1

## Environment Variables for `.env` file

```
GITHUB_TOKEN="YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"
DOMAIN="YOURDOMAIN.COM"
OWNER="GITHUB_USERNAME"
REPO="REPO_NAME"
```

## Basic Usage

#### Send `artifact_id` to the service

Type: `POST`, Endpoint: `/download`, Content-Type: `text/plain` (NOT JSON)

Sample Request using cURL (`artifact_id` is 114514):

```
curl -X POST -H "Content-Type: text/plain" -d '114514' 'https://yourdomain.com/download'
```

Sample Response:

```json
{
  "url": "yourdomain.com/download/3476234"
}
```
