const selector = '.kith-product-slider'

export function initKithProductSlider(root = document) {
    const sliders = root.querySelectorAll(selector)
    if (!sliders.length) return

    sliders.forEach((slider) => {
        const viewport = slider.querySelector('.kith-product-slider__viewport')
        const track = slider.querySelector('.kith-product-slider__track')
        const prev = slider.querySelector('.kith-product-slider__prev')
        const next = slider.querySelector('.kith-product-slider__next')
        const dotsWrap = slider.querySelector('.kith-product-slider__dots')
        if (!viewport || !track) return

        const cards = Array.from(track.querySelectorAll('.kith-product-card'))
        let perView = Number(getComputedStyle(slider).getPropertyValue('--kps-mobile')) || 1
        const perViewTablet = Number(getComputedStyle(slider).getPropertyValue('--kps-tablet')) || 2
        const perViewDesktop = Number(getComputedStyle(slider).getPropertyValue('--kps-desktop')) || 4

        let currentPage = 0

        function calcPerView() {
            const w = window.innerWidth
            if (w >= 1024) return Math.max(1, perViewDesktop)
            if (w >= 740) return Math.max(1, perViewTablet)
            return Math.max(1, perView)
        }

        function updateLayout() {
            perView = calcPerView()
            // set flex-basis on cards
            cards.forEach((c) => {
                c.style.flex = `0 0 ${100 / perView}%`
            })

            const pages = Math.max(1, Math.ceil(cards.length / perView))
            // rebuild dots
            dotsWrap.innerHTML = ''
            for (let i = 0; i < pages; i++) {
                const dot = document.createElement('button')
                dot.type = 'button'
                dot.className = 'kith-product-slider__dot'
                if (i === currentPage) dot.classList.add('active')
                dot.dataset.page = i
                dot.addEventListener('click', () => goToPage(i))
                dotsWrap.appendChild(dot)
            }

            // ensure currentPage in range
            if (currentPage >= pages) currentPage = pages - 1
            goToPage(currentPage, false)
        }

        function goToPage(page, smooth = true) {
            const pages = Math.max(1, Math.ceil(cards.length / perView))
            page = Math.max(0, Math.min(page, pages - 1))
            currentPage = page

            const left = page * viewport.clientWidth
            if (smooth) viewport.scrollTo({ left, behavior: 'smooth' })
            else viewport.scrollTo({ left, behavior: 'auto' })

            // update dots
            const dots = dotsWrap.querySelectorAll('.kith-product-slider__dot')
            dots.forEach((d) => d.classList.remove('active'))
            const activeDot = dotsWrap.querySelector(`.kith-product-slider__dot[data-page="${page}"]`)
            if (activeDot) activeDot.classList.add('active')
        }

        prev?.addEventListener('click', () => {
            goToPage(currentPage - 1)
        })

        next?.addEventListener('click', () => {
            goToPage(currentPage + 1)
        })

        window.addEventListener('resize', () => {
            updateLayout()
        })

        // allow keyboard navigation
        slider.addEventListener('keydown', (evt) => {
            if (evt.key === 'ArrowLeft') prev?.click()
            if (evt.key === 'ArrowRight') next?.click()
        })

        // set tabindex to make slider focusable
        slider.setAttribute('tabindex', '0')

        // initial layout
        updateLayout()
    })
}

// Auto-init on DOM ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initKithProductSlider()
    })
}
