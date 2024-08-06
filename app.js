const openModal1 = (e) => (
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-model','true')
)


document.querySelectorAll('.js-modal').forEach (a => {
    a.addEventListener('click', openModal1)
    
})