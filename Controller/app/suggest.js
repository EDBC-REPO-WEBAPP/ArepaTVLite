
const worker = require('worker_threads');
const fetch = require("molly-fetch");
const molly = require('molly-js');
const url = require('url');

/*-------------------------------------------------------------------------------------------------*/

module.exports = async(req,res)=>{

    const filt = 'peliculas|series';
    const regx = new RegExp(filt,'i');
    const resp = new Array();

    if( (regx).test(req.query.type) ){

        const filter = filt.split('|'); for( var i in filter ){
            const search = url.format({query: {
                length: 50, db: 'arepatv',
                target: req.query.filter,
                table: filter[i],
            }}); 
            const type = filter[i];
            const {data} = await fetch(`http://localhost:27017/match${search}`);
            data.map((x)=>{ resp.push(`
                <a onclick="show(this)" type="${type}" hash="${x.hash}" id="suggest" 
                   class="uk-inline uk-child-width-expand uk-height-medium">
                    <img class="uk-rounded" src="./img/placeholder.webp" lazy="${x.imagen}" alt="${x.nombre}">
                    <div class=" uk-position-top-left uk-position-small">
                        <span class="uk-badge uk-primary uk-enphasis"> ${type} </span>
                    </div> 
                </a>`); 
            });
        }
    
    } else {

        const search = url.format({ query: {
            length: 100, db: 'arepatv',
            target: req.query.filter,
            table: req.query.type,
        }});

        const {type} = req.query;
        const {data} = await fetch(`http://localhost:27017/match${search}`);
        data.map((x)=>{ resp.push(`
            <a onclick="show(this)" type="${type}" hash="${x.hash}" id="suggest" class="uk-inline uk-child-width-expand uk-height-medium">
                <img class="uk-rounded" src="./img/placeholder.webp" lazy="${x.imagen}" alt="${x.nombre}">
                <div class=" uk-position-top-left uk-position-small">
                    <span class="uk-badge uk-primary uk-enphasis"> ${type} </span>
                </div> 
            </a>`); 
        });

    }   
    
    res.send( 200,resp.join('\n') );

};
