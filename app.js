const openModal1 = (e) => (
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-model','true')
    modal = target
    modal.addEventListener('click', closemadl)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)

)

const openModal1 = (e) => {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute('aria-hidden','true')
    modal.removeAttribute('aria-model')
    modal.removeEventListener('click', closemadl)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal === null

}


document.querySelectorAll('.js-modal').forEach (a => {
    a.addEventListener('click', openModal1)
    
})