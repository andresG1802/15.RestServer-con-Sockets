const miFormulario = document.querySelector('form');
const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';


miFormulario.addEventListener('submit',ev=>{
    ev.preventDefault()
    const formData = {};
    for(let el of miFormulario.elements)
    {
        if(el.name.length >0)
        {
            formData[el.name] = el.value
        }
    }
    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        //Hubo un error en los headers entre las curly braces fue con el espacio
        headers: { 'Content-Type': 'application/json' }
    })
    .then(resp=>resp.json())
    .then(({msg,token})=>{
        if(msg)
        {
            return console.error(msg);
        }
        localStorage.setItem('token',token);
        window.location = 'chat.html';
    })
    .catch(err =>{
        console.log(err)
    });
});


function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    const body = {id_token: response.credential}
    
    fetch(url+'google',{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify(body)
    })
    .then(resp=>resp.json())
    //destructuramos el token de la data
    .then(({token})=>{
        localStorage.setItem('token',token);
        window.location = 'chat.html';
    })
    .catch(console.warn);
 }