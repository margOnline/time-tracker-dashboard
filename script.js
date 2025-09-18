const timePeriods = {
  'daily': 'Yesterday',
  'weekly': 'Last Week',
  'monthly': 'Last Month',
}

Object.entries(timePeriods).forEach((period) => {
  document
    .querySelector(`#${period[0]}ViewBtn`)
    .addEventListener('click', () => toggleTimePeriodView(period[0]))
})

function toggleTimePeriodView(period) {
  console.log('in toggle: ', period)
  const currentView = document.querySelector('[data-current-tab]')
  currentView.attributes['data-current-tab'].value = period
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
        const cardTitleElement = cardTemplate.querySelector('.category-name')
        cardTitleElement.textContent = activity.title
        cardTopperImg.src = `images/icon-${cardCategory}.svg`
        cardTopperImg.alt = `${activity.title}`
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

        console.log('activity: ', activity)
        console.log('cardCategory: ', cardCategory)

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
