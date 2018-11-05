// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
let gateway = '';

if (window.location.host === 'localhost:4200' ||
window.location.host === 'localhost:4301' || window.location.host === 'localhost:8100' ) {
  gateway = 'http://localhost:9000';
} else if (window.location.host === 'ec2-52-90-34-88.compute-1.amazonaws.com') {
  gateway = 'http://52.90.34.88:9000';
} else if (window.location.host === 'ec2-54-237-117-99.compute-1.amazonaws.com') {
//blue serve
  gateway = 'http://54.237.117.99:9000';
} else if (window.location.host === 'develop.fitcoapp.net') {
  gateway = 'http://52.90.34.88:9000';
} else if (window.location.host === '52.90.34.88') {
  gateway = 'http://52.90.34.88:9000';
} else if (window.location.host === 'wilder.fitcoapp.net') {
  gateway = 'http://52.23.236.228:9000';
} else if (window.location.host == 'diana.fitcoapp.net') {
  gateway = 'http://52.55.241.245:9000';
} else if (window.location.host == 'jessika.fitcoapp.net') {
  gateway = 'http://34.227.151.145:9000';
} else if (window.location.host == 'frank.fitcoapp.net') {
  gateway = 'http://34.228.240.95:9000';
} else if (window.location.host == 'release.fitcoapp.net') {
  gateway = 'http://34.228.240.95:9000';
} else if (window.location.host === 'localhost:4200' ||
  window.location.host === 'localhost:4301') {
  gateway = 'http://localhost:9000';
} else {
  gateway = 'https://nodejs.fitcoapp.net';
}

export const environment = {
  production: false,
  backendUrl: `${gateway}/api/`,
  firebase: {
    apiKey: "AIzaSyAR-6c2gY0G9INoJfN9cHlueSPRl1dvCwY",
    authDomain: "fitcoprod.firebaseapp.com",
    databaseURL: "https://fitcoprod.firebaseio.com",
    projectId: "fitcoprod",
    storageBucket: "fitcoprod.appspot.com",
    messagingSenderId: "759190042025"
  }
};
