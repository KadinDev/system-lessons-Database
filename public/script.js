
const currentPage = location.pathname
const active_menu = document.querySelectorAll('.pages a')

for ( let active of active_menu ) {
    if ( currentPage.includes(active.getAttribute('href')) ) {
        active.classList.add('active')
    }
}


function paginate( selectedPage, totalPages){

    let 
        pages = [],
        oldPage

    for ( let currentPage = 1; currentPage <= totalPages; currentPage++ ) {

        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage +2
        const pagesBeforeSelectedPage = currentPage >= selectedPage -2

        if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage ) {

            if ( oldPage && currentPage - oldPage > 2 ) {
                pages.push('...')
            }

            if ( oldPage && currentPage - oldPage == 2 ) {
                pages.push(oldPage + 1)
            }
            
            pages.push(currentPage)

            oldPage = currentPage
        }

    }

    return pages
}

function createPagination(pagination) {

    // o + na frente para transformar em número
    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    
    
    const pages = paginate( page, total )
    
    let elements = ''
    
    // += concatenação
    // dessa forma mostrará na tela os números das páginas
    for ( let page of pages ) {
    
        // Includes irá pesquisar se tem os (...),
        // encontrando irá transformar em String
        if(( String(page).includes('...') ) ) {
    
            // e colocará em uma span
            elements += `<span> ${page} </span>`
    
        } else {
    
            if (filter){
    
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
    
    
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
    
            }
        
        }
    
    }
    
    pagination.innerHTML = elements
}

const pagination = document.querySelector('.pagination')

if (pagination){
    createPagination(pagination)
}
