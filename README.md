[![Build Status](https://travis-ci.org/Frizz925/cf-booth-map.svg?branch=version-2)](https://travis-ci.org/Frizz925/cf-booth-map)

# Comic Frontier Booth Map

## Introduction

Comic Frontier is a creators market event that is held bi-annually with hundreds of exhibitors attending the event. As the number of exhibitors rises each year, it's becoming a challenge for visitors to find the exhibitors in the venue.

This interactive map is aimed to help the visitors to navigate the venue to find the exhibitors they wanted to visit and also promote discovery of the exhibitors.

## Demo

Version 1: <https://cf-map.kogane.moe/>

Version 2: <https://cf-booth-map.web.app/> (In-development)

Version 2 is a complete rewrite that is aimed to provide better user experience and performance through the use of HTML5 canvas and WebGL for devices that support it.

## Frontend

### Tech Stack

Build tools

- [TypeScript](https://www.typescriptlang.org/)
- [Webpack](https://webpack.js.org/)
- [Babel](https://babeljs.io/)
- [Sass](https://sass-lang.com/)

Notable libraries

- [React](https://reactjs.org/)
- [MobX](https://mobx.js.org/)
- [PixiJS](https://www.pixijs.com/)

### Setup

It is recommended to use Yarn for packages installation and running build scripts.

```sh
yarn
```

### Build

Babel is used to transpile the TypeScript source codes while Webpack is used to bundle the files for production. The following script will build the application in production mode into `dist` directory.

```sh
yarn build
```

### Development

`webpack-dev-server` is used as the development server along with `react-hot-loader` to enable the HMR capability. Running the following command will start the development server at `localhost:3000`.

```sh
yarn dev
```

## Deployment

*This section is still WIP*

The site uses [AWS S3 bucket](https://aws.amazon.com/s3/) to host the static website with [CloudFlare CDN](https://www.cloudflare.com/cdn/) to serve it to the users.

These are the requirements needed for deployment:

- Registered domain
- [CloudFlare account](https://www.cloudflare.com/dns/)
- [AWS account](https://console.aws.amazon.com/)
- [AWS CLI](https://aws.amazon.com/cli/)
- [GPG key](https://help.github.com/en/github/authenticating-to-github/generating-a-new-gpg-key)

### Provisioning

Terraform is used to easily provision the infrastructure with correct configurations and will provision the required resources both on AWS and CloudFlare sides.

Run the following command to generate your PGP public key.

```sh
gpg --export <email> | base64 > pubkey.asc
```

Run the following command to start provisioning.

```sh
terraform init
terraform apply
```

### Deploying Application

Since the website is basically an S3 bucket, you can run the following command to build and immediately deploy the application.

```sh
yarn build
aws s3 sync --delete dist s3://<S3 website bucket name>/
```

### Continuous Deployment

Travis CI is used to keep the deployed application updated with each code changes pushed into the repository.

## License

MIT
