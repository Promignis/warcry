function displayFire() {
    const fire = document.querySelector(".fire")
    Array.from(Array(50).keys()).forEach((i) => {
        const fireParticle = document.createElement("div")
        fireParticle.className = "particle"
        fire.appendChild(fireParticle)
    })
}

function displayDaysLeft() {
    const daysLabel = document.querySelector(".promignis-days")
    let timer = countdown(
        new Date("November 04, 2018 21:30:00"),
        (ts) => {
            daysLabel.innerHTML = ts.days
        },
        countdown.DAYS|countdown.HOURS
    )
}

function displayQuote() {
    fetch("http://quotes.rest/qod.json?category=inspire")
    .then(function (response) {
        if (response.ok) {
            response.json().then((resp) => {
                if (!resp.success) return
                console.log(resp)
                const quotesLabel = document.querySelector(".quote-text")
                const sourceLabel = document.querySelector(".quote-source")
                quotesLabel.innerText = resp.contents.quotes[0].quote
                sourceLabel.innerText = "- " + resp.contents.quotes[0].author
            })
        } else {
            throw new Error("Could not reach the API: " + response.statusText);
        }
    })
    .catch(function (er) {
        console.warn("unknown response " + er)
    })
}

function updateState(state) {
    const quoteDiv = document.querySelector(".quote")
    const promignisDiv = document.querySelector(".promignis")
    let visibleSide = quoteDiv
    let hiddenSide = promignisDiv
    if (state == "quote") {
        visibleSide = quoteDiv
        hiddenSide = promignisDiv
    } else {
        visibleSide = promignisDiv
        hiddenSide = quoteDiv
    }
    visibleSide.style.display = "block"
    hiddenSide.style.display = "none"
    localStorage.setItem("state", state)
}

function init() {
    //show fire
    displayFire()

    //show quote
    displayQuote()

    //show days
    displayDaysLeft()

    //get previous state
    const checkbox = document.querySelector("#myonoffswitch")
    let state = localStorage.getItem("state") || "quote"
    if (state == "quote") {
        checkbox.checked = false
    }
    updateState(state)
    checkbox.addEventListener("change", (ev) => {
        state = checkbox.checked ? "promignis" : "quote"
        updateState(state)
    })
}

window.addEventListener("load", () => {
    init()
})
