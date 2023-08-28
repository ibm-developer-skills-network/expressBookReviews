const axios = require('axios').default;


const connectToURL = (url)=>{
    const req = axios.get(url);
    console.log(req);
    req.then(resp => {
        console.log("Fulfilled")
        console.log(resp.data);
        console.log('**************************')
    })
    .catch(err => {
        console.log("Rejected for url "+url)
        console.log(err.toString())
    });
}


connectToURL('http://localhost:5000/')

connectToURL('http://localhost:5000/isbn/1')
connectToURL('http://localhost:5000/author/Unknown')
connectToURL('http://localhost:5000/title/The Book Of Job')


