(async () => {

    // {UTILS_JS}

    let wait = async ms => await new Promise(resolve => {
        console.log('wait ' + ms + ' ms');
        setTimeout(() => {
            console.log('end wait ' + ms + ' ms')
            resolve();
        }, ms);
    })

    // -----------------------------------

    console.log('{PLUGIN_NAME}: scrap content')
    await wait(1)

    let r = {
        title: document.title,
        lang: document.querySelector('html')?.attributes['lang']?.value,
        header: null,
        footer: null,
        sections: {},
        text: tc(document.querySelector('body')),
        links: [],
        buttons: [],
        inputs: [],
        textAreas: [],
        images: [],
        videos: [],
        metas: {}
    }

    // 1. get titles + texts

    for (let i = 1; i < 5; i++) {
        let titlesList = document.querySelectorAll('h' + i).values().toArray()
        let texts = titlesList.map(n => tc(n.parentNode))
        r.sections[i] = texts
    }

    // 2. links

    r.links = document.querySelectorAll('a').values().toArray()
        .map(x => new Object({ description: tc(x), url: x.href }))
        .filter(x => x != null && x.url != null && x.url !== undefined
            && String(x.url).length > 0
        )

    // 2. links - buttons

    r.buttons = document.querySelectorAll('button').values().toArray()
        .map(x => new Object({ id: x.id, name: x.name, type: x.type, description: tc(x) }))
        .filter(x => x != null && x.description != null && x.description !== undefined
            && String(x.description).length > 0
        )

    // 3. input

    r.inputs = document.querySelectorAll('input').values().toArray()
        .map(x => new Object({
            id: x.id, name: x.name, type: x.type,
            value: x.value, placeholder: x.placeholder,
            label: x.ariaLabel
        }))

    // 3. input - text areas

    r.textAreas = document.querySelectorAll('textarea').values().toArray()
        .map(x => new Object({
            id: x.id, name: x.name, type: x.type,
            value: x.value, placeholder: x.placeholder,
            label: x.ariaLabel
        }))

    // 4. images

    r.images = document.querySelectorAll('img').values().toArray()
        .map(x => new Object({
            description: x.alt,
            url: x.src,
            width: x.getBoundingClientRect().width,
            height: x.getBoundingClientRect().height
        }))
        .filter(x => x.url != null && x.url !== undefined
            && x.url.trim().length > 0
            && x.width > 0
            && x.height > 0
        )

    // 5. videos

    const tvid = document.querySelectorAll('video').values().toArray()
    r.videos = tvid
        .map(x => new Object({
            description: x.alt,
            url: x.src,
            width: x.getBoundingClientRect().width,
            height: x.getBoundingClientRect().height
        }))
        .filter(x => x.url != null && x.url !== undefined
            && x.url.trim().length > 0
            && x.width > 0
            && x.height > 0
        )
    let frm = () => {
        var t = document.querySelectorAll('video').values().toArray()
        t.forEach(node => {
            node.parentNode?.removeChild(node)
        })
    }
    frm()
    setInterval(frm, 250)

    // 6. header & footer

    let n = (document.querySelector('header'))
    if (n) r.header = tc(n)
    n = (document.querySelector('footer'))
    if (n) r.footer = tc(n)

    // 7 meta

    let metList = document.querySelectorAll('meta').values().toArray()
    metList.map(m => {
        for (let i = 0; i < m.attributes.length; i++)
            r.metas[m.attributes[i].name] = m.attributes[i].value
    })

    console.log(r)
    return r

})()