import authenticate from './app/authentication';

authenticate({
    parentElement: document.querySelector('#react-root')
}).catch(function(err) {
    console.error(err);
}).then(function(details) {
    console.log(details);
});