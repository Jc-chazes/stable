let gateway = '';

if (window.location.host === 'localhost:4200' ||
window.location.host === 'localhost:4301') {
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
  production: true,
  backendUrl: `${gateway}/api/`,
  firebase: {
    apiKey: "AIzaSyDVaB-O6zFd04JXVt-iQkog7N9Hb1gt4nI",
    authDomain: "chatw-bf42d.firebaseapp.com",
    databaseURL: "https://chatw-bf42d.firebaseio.com",
    projectId: "chatw-bf42d",
    storageBucket: "chatw-bf42d.appspot.com",
    messagingSenderId: "953190867830"
  }
};
