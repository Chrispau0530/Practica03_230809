const express = require('express');
const session = require('express-session');
const moment = require ('moment-timezone');

const app = express();
const port = 3000;

// Configuración para poder leer los datos del cuerpo de las solicitudes (req.body)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de la sesión
app.use(session({
    secret: 'p3-CPRP#CHRISPAU-sesionespersistentes',  // Una clave secreta para cifrar la sesión
    resave: false,  // No resguardar la sesión si no hay cambios
    saveUninitialized: true,  // Guardar la sesión incluso si no se ha modificado
    //cookie: { secure: false } 
    cookie: {secure: false, maxAge: 24 *60 * 60 * 1000  }  // Usar false para que funcione en entorno local sin HTTPS,maxAge permite definir la duracion maxima de la sesion 
}));

// Ruta para mostrar el formulario de login
// Ruta para mostrar el formulario de login
app.get('/user', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Iniciar sesión</title>
        <style>
            /* Estilos generales para la página */
            body {
                font-family: 'Arial', sans-serif;
                background: linear-gradient(to right, #ff7e5f, #feb47b); /* Fondo degradado */
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                color: #333;
            }

            /* Estilos para el contenedor del formulario */
            .login-container {
                background-color: rgba(255, 255, 255, 0.9); /* Fondo blanco semi-transparente */
                padding: 30px 40px;
                border-radius: 10px;
                box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1); /* Sombra suave */
                text-align: center;
                width: 100%;
                max-width: 400px;
            }

            h1 {
                color: #333;
                font-size: 2em;
                margin-bottom: 20px;
                font-weight: 600;
            }

            /* Estilo del formulario y sus elementos */
            form {
                width: 100%;
            }

            .form-group {
                margin-bottom: 20px;
                text-align: left;
            }

            label {
                font-size: 1em;
                color: #333;
            }

            input[type="text"] {
                width: 100%;
                padding: 10px;
                margin-top: 5px;
                border: 2px solid #ddd;
                border-radius: 5px;
                font-size: 1em;
                transition: border 0.3s ease;
            }

            input[type="text"]:focus {
                border-color: #ff7e5f; /* Resalta el borde cuando el input está enfocado */
                outline: none;
            }

            button {
                width: 100%;
                padding: 12px;
                background-color: #ff7e5f;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 1.1em;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            button:hover {
                background-color: #feb47b; /* Cambia el color de fondo al pasar el mouse */
            }

            /* Responsividad para pantallas más pequeñas */
            @media (max-width: 600px) {
                .login-container {
                    width: 80%;
                    padding: 20px;
                }

                h1 {
                    font-size: 1.8em;
                }
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <h1>Iniciar sesión</h1>
            <form action="/login" method="POST">
                <div class="form-group">
                    <label for="user">Nombre de usuario:</label>
                    <input type="text" id="user" name="user" required>
                </div>
                <button type="submit">Iniciar sesión</button>
            </form>
        </div>
    </body>
    </html>
    `);
});


// Ruta POST para manejar el login
app.post('/login', (req, res) => {
    const { user } = req.body;  // Recuperamos el nombre de usuario desde el formulario
    if (user) {
        req.session.user = user;  // Guardamos el nombre de usuario en la sesión
        req.session.createdAt = new Date().toISOString();  // Guardamos la fecha de creación de la sesión
        req.session.lastAccess = new Date().toISOString();  // Guardamos el último acceso
        res.redirect('/profile');  // Redirigimos a la página de perfil
    } else {
        res.send('Por favor ingresa un nombre de usuario.');
    }
});

// Ruta para mostrar el perfil del usuario
app.get('/profile', (req, res) => {
    if (req.session && req.session.user) {
        const sessionId = req.session.id;
        const user = req.session.user;
        const createdAt = req.session.createdAt;
        const lastAccess = req.session.lastAccess;
        const sessionDuration = (new Date() - new Date(createdAt)) / 1000; //Duración de la sesión en segundos

        res.send(`
            <center>
            <h1>Perfil del Usuario</h1>
            <p><strong>ID de sesión:</strong> ${sessionId}</p>
            <p><strong>Usuario:</strong> ${user}</p>
            <p><strong>Fecha de creación de la sesión:</strong> ${createdAt}</p>
            <p><strong>Último acceso:</strong> ${lastAccess}</p>
            <p><strong>Duración de la sesión (en segundos):</strong> ${sessionDuration}</p>
            </center>
        `);
    } else {
        res.redirect('/login'); // Si no hay sesión activa, redirige a la página de login
    }
});

// Ruta para mostrar los detalles de la sesión
app.get('/session', (req, res) => {
    if (req.session) {
        const sessionId = req.session.id;
        const user = req.session.user;
        const createdAt = req.session.createdAt;
        const lastAccess = req.session.lastAccess;
        const sessionDuration = (new Date() - new Date(createdAt)) / 1000; //Duración de la sesión en segundos
        
        res.send(`
        
            <center>
            <h1>Detalles de la sesión</h1>
            <p><strong>ID de sesión:</strong>${sessionId}</p>
            <p><strong>Usuario:</strong>${user || 'No definido'}</p>
            <p><strong>Fecha de creación de la sesión:</strong>${createdAt}</p>
            <p><strong>Último acceso:</strong>${lastAccess}</p>
            <p><strong>Duración de la sesión (en segundos):</strong>${sessionDuration}</p>
            </center>       
        `);
    }
});
//Ruta para inicializar la sesion 

app.get('/papa',(req,res)=>{
if(!req.session.createdAt){
 req.session.createdAt= new Date();
 req.session.lastAccess = new Date();
 res.send("La sesion ha sido iniciada")   
}else{
    res.send("Ya existe la sesion")
}

})

//Ruta para actualizar la fecha de ultima consulta 
app.get("/update",(req,res)=>{
if(req.session.createdAt){
    req.session.lastAccess = new Date();
    res.send("La fecha de ultimo acceso ha sido actualizada ")
}else{
    res.send("No hay una sesion activa ")
}
})


//Ruta para obtener el estado de la sesion 
app.get('/status',(req,res) => {
    if(req.session.createdAt){
        const now = new Date();
        const started = new Date(req.session.createdAt)
        const lastUpdate = new Date(req.session.lastAccess)

        //Calcular la antiguedad de la sesion 
        const sesionAgeMS= now - started;
        const hours = Math.floor(sesionAgeMS/ (100*60*60))
        const minutes = Math.floor((sesionAgeMS % (1000*60*60))/(1000*60))
        const seconds=Math.floor((sesionAgeMS % (1000*60))/1000)

        const createAD_CDMX = moment(started).tz('America/Mexico_Ciry').format('YYY-MM-DD HH:mm:ss')
        const lastAccess = moment(lastUpdate).tz('America/Mexico_Ciry').format('YYY-MM-DD HH:mm:ss')
res.json({
    message : 'Estado de la sesion',
    sessionId : req.sessionID,
    inicio:createAD_CDMX,
    ultimoAcceso: lastAccess,
    antiguedad:`${hours} horas ,${minutes} minutos y ${seconds} segundos `
})

    }else{
        res.send('No existe una cuenta para el status')
    }
})

// Ruta para cerrar la sesion 

app.get('/lagout',(req,res)=>{
    if(req.session.createdAt){
        req.session.destroy((err)=>{
            if(err){
                return res.status(500).send('Error al cerrar sesion ')
            }
            res.send('sesion cerrada correctamente ')
        })
    }else{
        res.send('No hay una sesion activa para cerrar')
    }
})



app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});
