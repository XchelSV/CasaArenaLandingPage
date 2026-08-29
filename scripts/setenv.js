const { writeFile } = require('fs');
const { argv } = require('yargs');

// read environment variables from .env file
require('dotenv').config();

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';

const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;

// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   mapsApiKey: "${process.env.MAPS_API_KEY}",
   WHATSAPP_SOURCE_MOBILE: "${process.env.WHATSAPP_SOURCE_MOBILE}",
   CDN_URL: "${process.env.CDN_URL}",
   API_GATEWAY: "${process.env.API_GATEWAY}",
   COGNITO_USER_POOL_ID: "${process.env.COGNITO_USER_POOL_ID}",
   COGNITO_APP_CLIENT_ID: "${process.env.COGNITO_APP_CLIENT_ID}",
   COGNITO_DOMAIN: "${process.env.COGNITO_DOMAIN}",
   COGNITO_REDIRECT_SIGN_IN: "${process.env.COGNITO_REDIRECT_SIGN_IN}"
};
`;

// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err) {
   if (err) {
      console.log(err);
   }

   console.log(`Wrote variables to ${targetPath}`);
});
