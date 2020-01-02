// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  
   //apiUrl: 'https://testapi.rojgaar.in/api/',
  apiUrl:'http://localhost:50446/api/',
  ysUrl: 'https://testapi.yuvasampark.com/api/',
  // apiUrl: 'https://ziv59s8fn2.execute-api.ap-south-1.amazonaws.com/Prod/api/',
  // ysUrl: 'https://vlw49m7uq9.execute-api.ap-south-1.amazonaws.com/Prod/api/',
   
  signalrHub: 'http://localhost:50446/signalr',
  DomainName: 'localhost',
  mrigsUrl:'http://192.168.1.241:9017/',
}; 


