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
      button.setAttribute('aria-pressed', true)
    } else {
      button.setAttribute('aria-pressed', false)
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
  try {
    const response = await fetch('data.json')
    if (!response.ok) {
      throw new Error('Error fetching data')
    }
    const data = await response.json()
    const cards = document.querySelector('.cards')

    data.forEach((activity) => {
      const cardTemplate = document
        .querySelector('.dashboard-template')
        .content.cloneNode(true)

      setupCardTemplate(cardTemplate, activity)
      insertActivityHours(cardTemplate, activity)

      cards.appendChild(cardTemplate)
    })
  } catch (error) {
    console.error('Error rendering dashboard: ', error)
  }
}

function setupCardTemplate(cardTemplate, activity) {
  const cardCategory = activity.title.toLowerCase().replace(/ /g, '-')
  const cardTopperImg = cardTemplate.querySelector('.card-topper img')

  cardTopperImg.src = `images/icon-${cardCategory}.svg`
  cardTopperImg.alt = `${activity.title}`
  cardTemplate.querySelector('.category-name').textContent = activity.title
  cardTemplate.querySelector('li.card').className = `card ${cardCategory}`
}

function insertActivityHours(cardTemplate, activity) {
  Object.entries(timePeriods).forEach((period) => {
    const currentHours = formatHours(activity.timeframes[period[0]].current)
    cardTemplate.querySelector(`.current-timings .${period[0]}`).textContent =
      currentHours

    const previousHours = formatHours(activity.timeframes[period[0]].previous)
    cardTemplate.querySelector(
      `.previous-timings .${period[0]}`
    ).textContent = `${period[1]} - ${previousHours}`
  })
}

function formatHours(number) {
  return number > 1 ? `${number}hrs` : `${number}hr`
}

renderTrackingDashboard()
