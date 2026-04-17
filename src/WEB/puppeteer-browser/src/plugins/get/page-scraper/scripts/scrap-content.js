(async () => {

    let wait = async ms => await new Promise(resolve => {
        console.log('wait ' + ms + ' ms');
        setTimeout(() => {
            console.log('end wait ' + ms + ' ms')
            resolve();
        }, ms);
    })

    let textContent = (node, f) => {
        var r = ''
        var childs = node.childNodes.values().toArray()
        if (childs.length == 0) {
            if (node.textContent && node.textContent.trim().length > 0)
                return '\n' + node.textContent
            return ''
        }
        childs.forEach(c => {
            r += f(c, f)
        })
        return r
    }

    let tc = node => textContent(node, textContent)?.trim()

    // -----------------------------------

    console.log('scrap content')
    await wait(1)

    let r = {
        title: document.title,
        lang: document.querySelector('html')?.attributes['lang']?.value,
        header: null,
        footer: null,
        sections: {},
        text: tc(document.querySelector('body')),
        links: [],
        images: [],
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
        .map(x => new Object({ text: tc(x), href: x.href }))
        .filter(x => x.href != null && x.href !== undefined)

    // 3. images

    r.images = document.querySelectorAll('img').values().toArray()
        .map(x => new Object({ alt: x.alt, src: x.src }))

    // 4. header & footer
    let n = (document.querySelector('header'))
    if (n) r.header = tc(n)
    n = (document.querySelector('footer'))
    if (n) r.footer = tc(n)

    // 5. meta
    let metList = document.querySelectorAll('meta').values().toArray()
    metList.map(m => {
        for (let i = 0; i < m.attributes.length; i++)
            r.metas[m.attributes[i].name] = m.attributes[i].value
    })

    return r

})()