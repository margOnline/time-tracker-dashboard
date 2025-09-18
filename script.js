const timePeriods = {
  'daily': 'Yesterday',
  'weekly': 'Last Week',
  'monthly': 'Last Month',
}

Object.keys(timePeriods).forEach((period) => {
  document.querySelector(`#${period}ViewBtn`).addEventListener('click', () => {
    toggleTimePeriodBtn(period)
    toggleTimePeriodData(period)
  })
})

function toggleTimePeriodBtn(period) {
  document.querySelectorAll('nav button').forEach((button) => {
    if (button.textContent.toLowerCase() === period) {
      button.attributes['aria-pressed'].value = true
    } else {
      button.attributes['aria-pressed'].value = false
    }
  })
}

function toggleTimePeriodData(period) {
  document.querySelectorAll('.timings p span').forEach((span) => {
    if (Array.from(span.classList).includes(period)) {
      span.classList.remove('hidden')
    } else {
      span.classList.add('hidden')
    }
  })
}

async function renderTrackingDashboard() {
  await fetch('data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error fetching data')
      }
      return response.json()
    })
    .then((data) => {
      const cards = document.querySelector('.cards')
      const dashboard = document.querySelector('.dashboard-template')
      data.forEach((activity) => {
        const cardTemplate = dashboard.content.cloneNode(true)
        const cardCategory = activity.title.toLowerCase().replaceAll(' ', '-')
        const cardTopperImg = cardTemplate.querySelector('.card-topper img')

        cardTopperImg.src = `images/icon-${cardCategory}.svg`
        cardTopperImg.alt = `${activity.title}`
        cardTemplate.querySelector('.category-name').textContent =
          activity.title
        cardTemplate.querySelector('li.card').className = `card ${cardCategory}`

        Object.entries(timePeriods).forEach((period) => {
          cardTemplate.querySelector(
            `.current-timings .${period[0]}`
          ).textContent = `${activity.timeframes[period[0]].current} hrs`

          cardTemplate.querySelector(
            `.previous-timings .${period[0]}`
          ).textContent = `${period[1]} - ${
            activity.timeframes[period[0]].previous
          } hrs`
        })

        cards.appendChild(cardTemplate)
      })
    })

  // try {
  //   const response = await fetch('/data.json')
  //   const data = await response.json()
  //   renderCards(data)
  // } catch (err) {
  //   console.log('Error fetching data')
  // }
}

// function renderCards(data) {
//   const dashboard = document.querySelector('.dashboard-template')
//   data.forEach((activity) => {
//     const card = createCard(activity)
//     dashboard.appendChild(card)
//   })
// }

// function createCard(activity) {
//   console.log('activilty: ', activity)
//   const card = document.querySelector('li.card')
//   const cardBanner = card.querySelector('.banner')
//   card.classList.add(activity.title)
// }

renderTrackingDashboard()
