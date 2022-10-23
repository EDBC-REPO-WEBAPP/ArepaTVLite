const script = `<script> window.top.location.href="https://arepatv.ml/login?m=T3BwcyBhbGdvIHNhbGlvIG1hbA==" </script>`;

const template = `<!DOCTYPE html><html lang="es">
    <head>

        <!-- SEO -->
        <meta charset="utf-8">
        <meta name="robots" content="noindex,nofollow">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="ArepaTV: Reproductor de Video">
        <meta name="keywords" content="Peliculas, Series, Anime, Documentales">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">

        <!----->
        <link rel="canonical" href="https://arepatv.ml/app/play" />
        <!--Molly-->
        <link rel="stylesheet" href="/molly.css">
        <link rel="stylesheet" href="/css/app.css">
        <script type="text/javascript" src="/molly.js"></script>
        <!-- VideoJS --> 
        <script src="https://cdn.plyr.io/3.7.2/plyr.js"></script>
        <link rel="stylesheet" href="https://cdn.plyr.io/3.7.2/plyr.css" />
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6B0N2VM8W7"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date()); gtag('config', 'G-6B0N2VM8W7');
        </script> 
        <title> ...redirecting... </title>

        <meta http-equiv="refresh" content="2;url=https://dood.wf_URL_" />
        <style> * { background-color: black } </style>

    </head> <body class="uk-width-expand uk-height-expand uk-flex uk-flex-center uk-flex-middle">
        <span uk-spinner="ratio: 3" class="uk-spinner uk-primary"></span>
    </body>
</html>`;

/*-------------------------------------------------------------------------------------------------*/

const fetch = require("molly-fetch");
const molly = require('molly-js');
const url = require('url');

/*-------------------------------------------------------------------------------------------------*/

function DoodStreamServer(magnet){
    return new Promise((response,reject)=>{
        search = url.format({
            host: 'https://doodapi.com/api/file/info',
            query: { key: process.env.DOOD, file_code: magnet }
        }); fetch( search ).then(({data})=>{
            const _url = data.result[0].protected_embed;
            const res = template.replace('_URL_',_url)
            response(res); //console.log(data);
        }).catch((e)=>{ reject(e) });
    })
}

/*-------------------------------------------------------------------------------------------------*/

function responseMovie( req,res ){
    return new Promise((response,reject)=>{

        const tmp = req.query.tmp;
        const cap = req.query.cap;
        const type = req.query.type;
        const hash = req.query.hash;
        const query = `?db=arepatv&table=${type}&target=${hash}`;

        fetch(`http://localhost:27017/hash${query}`)
        .then(async({data})=>{
            if( !cap && !tmp ) response( await DoodStreamServer(data[0].magnet) );
            else { 
                const {id} = data[0].magnet[tmp][cap];
                response( await DoodStreamServer(id) );
            }
        }).catch(e=>{ reject( e?.message || e?.response?.data || e); console.log(e); });

    });
}

module.exports = (req,res)=>{

    const auth = req.parse.cookie?.auth;
    console.log( req.url, req.parse.ip );

    responseMovie( req,res )
    .then((data)=>res.send(200,data))
    .catch((e)=>{ res.send(404,e); console.log(e) });

}