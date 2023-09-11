# Netlify Preview Service

Since Github Actions only provide a zipped artifact and it's sometimes annoying since there is only ONE file inside that zip file. It makes users harder to preview the artifact. 

This service is designed for [OI-Wiki](https://github.com/OI-wiki/OI-wiki) project. It can help accelerate the review process for collaborators, since the only file in the Artifact is one single PDF file.

## Environment

node v18.17.1

### Variables in `.env` files
```
GITHUB_TOKEN="your-github-personal-access-token"
domain="your-domain"
```


## Basic Usage

#### Send `artifact_id` to the service

Type: `POST`, Endpoint: `/download`

Sample Response:

```json
{
    "url": "domain.com/download/3476234"
}
```
