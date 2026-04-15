// browser script: parse google search 'result' page

(async () => {

    // 1. check captcha

    if (window.location.pathname == '{catchaPathName}')
        return 'CAPTCHA_BEFORE_RESULT_PAGE'

    // 2. parse result list

    var includeYouTubeResults = '{includeYouTubeResults}' == 'true'
    var excludeEmptyTopics = '{excludeEmptyTopics}' == 'true'

    // the postfix 'ved' in 'data-ved' is surelly periodically changed
    let list = document.querySelectorAll('a[ping][data-ved]').values().toArray()
        .filter(x => x.id == '')

    let results = list.map((x, i) => new Object({ index: i, topic: x.innerText, href: x.href }))
    if (excludeEmptyTopics)
        results = results.filter(x => x.topic != null && x.topic.length > 0)
    if (!includeYouTubeResults)
        results = results.filter(x => !x.href.startsWith('https://www.youtube.com/'))

    let pagesList = document.querySelectorAll('a[aria-label] > span').values().toArray()
        .splice(1)
        .map(x => x.parentNode)
    let pages = pagesList.map((x, i) => new Object({ page: i + 2, href: x.href }))

    // ai content

    let n = document.querySelectorAll('mark')[0]
    n = n.parentNode.parentNode
    let aiContent = n.textContent

    let result = { results: results, pages: pages, aiContent: aiContent }

    console.log(result)
    return result

})()