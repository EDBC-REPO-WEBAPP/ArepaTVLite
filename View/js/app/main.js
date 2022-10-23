function temporadaSelector(){
    const selector = $$('#selector');
    selector.forEach(x=>{
        addEvent(x,'click',()=>{
            const btn = $$('[active]');
            const show = $$(x.getAttribute('show'));
            const hide = $$(x.getAttribute('hide'));
            btn.forEach((y)=>{ y.setAttribute('active','false') });
            hide.forEach((y)=>{ y.hidden = true });
            show.forEach((y)=>{ y.hidden = false});
            x.setAttribute('active','true');
        });
    });
}

function clearMovieModal( ..._el ){
    UIkit.modal(_el[0]).show(); _el[1].innerHTML = `
        <div class="uk-primary uk-position-center" uk-spinner="ratio: 3"></div>
    `;
}

function show( _el ){

    $('input[type=search]').value = "";

    clearMovieModal( $('modal'),$('#modal') );
    const hash = _el.getAttribute('hash');
    const type = _el.getAttribute('type');
    const search = new URLSearchParams();

    search.set('filter',hash);
    search.set('type',type);

    fetch('/app/hash?'+search.toString()).then(async(res)=>{
        $('#modal').innerHTML = await res.text();
        temporadaSelector();
    }).catch(e=>{ console.error(e) })

}

function play( _el ){

    clearMovieModal( $('play'),$('#play') );
    const search = new URLSearchParams();
    const url = _el.getAttribute('url');

    $('#play').innerHTML = `
        <iframe src="${url}" allowfullscreen></iframe>
    `;

}

function suggest(){
    if(window['_suggest_']) return undefined;
        window['_suggest_'] = true;

    const filter = $('input[type=search]').value;
    const search = new URLSearchParams();

    search.set('type',query.get('type')||'peliculas');
    search.set('filter',filter);

    fetch(`/app/suggest?${search.toString()}`).then(async(resp)=>{
        $('#suggest-list').innerHTML = await resp.text();
        console.log($('input[type=search]').value);
        if( (/nfsw/i).test($('input[type=search]').value) )
             loadPorno()
        window['_suggest_'] = false;
    }).catch(e=>{console.error(e)});
}

function closePlayer(){
    UIkit.modal($('modal')).show();
    $('#play').innerHTML = '';
}

function loadContent(_el,result){
    result = result.split('|'); for( var i in result ){
        const newEl = createElement('div'); 
              newEl.innerHTML = result[i];
        _el.appendChild(newEl);
    }
}

function loadMore(){

    if( window.isLoading )  return undefined;
        window.isLoading = true;

    const offset = $$('#movie').length;
    const search = new URLSearchParams();

    if( query.get('filter') ) search.set('filter',query.get('filter'));
        search.set('type',query.get('type')||'peliculas');
        search.set('offset',offset);
        search.set('length',60);

    fetch('./app/movie?'+search.toString())

    .then(async(res)=>{
        const result = await res.text();
        loadContent($('#movie-list'),result); window.isLoading = false;        
    })

    .catch(e=>{
        window.isLoading = false; console.error(e);
    })

}

function loadPorno(){
    window.location = '?type=porno';
}

function search(){

    const search = new URLSearchParams();
    const searchBar = $('input[type=search]');
    search.set('type',query.get('type')||'peliculas');

    /*
    addEvent(searchBar,'change',()=>{
        setTimeout(()=>{

            if( searchBar.value == "" ) return 0;
            if( (/nfsw/i).test(searchBar.value) )
                loadPorno();
    
            search.set('filter',searchBar.value);
            window.location = '?'+search.toString();
    
        },1000);
    });
    */

}

addEvent($('input[type=search]'),'keydown',(ev)=>{ suggest(); });
addEvent($('input[type=search]'),'change',(ev)=>{ suggest(); });
addEvent(window,'load',()=>{ loadMore(); search(); });
addEvent(window,'scroll',(ev)=>{
    const target = $('body').scrollHeight - 0.2 * $('body').scrollHeight;
    const scroll = window.scrollY + window.innerHeight;
    if( scroll > target ) loadMore();
});
