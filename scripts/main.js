const tileContainer = document.querySelector(".tiles")
let tile = Array.from(tileContainer.querySelectorAll('.tile'))
let emptyTile = document.querySelector('.empty')

const tileWidth = tile[0].offsetWidth
const tileHeight = tile[0].offsetHeight

const timeContainer = document.querySelector('.time')
const time = timeContainer.querySelector('p')

const divVictory = document.querySelector('.victory')
const titleRecord = divVictory.querySelector('h2#new-record')
const record = divVictory.querySelector('p#record')
const bestRecord = divVictory.querySelector('p#best-record')

const divCredit = document.querySelector('.credit-container')
const creditContainer = divCredit.querySelector('div')

const buttonStart = document.querySelector('.start')
const buttonRetry = document.querySelector('.retry')
const buttonCredit = document.querySelector('#credit')
let sec = min = hour = 0
let isPlaying = false
let inTransition = false
let intervalId = null


tile.forEach((t, index) => {
	t.addEventListener('click', async () => {
		if (!isPlaying || inTransition) return
		inTransition = true

		const tileRect = t.getBoundingClientRect()
		const emptyTileRect = emptyTile.getBoundingClientRect()

		const inTop = tileRect.top === emptyTileRect.top

		const inLeft = tileRect.left === emptyTileRect.left

		const topDiff = Math.abs(tileRect.top - emptyTileRect.top) > 0 && Math.abs(tileRect.top - emptyTileRect.top) <= tileHeight + 1 && inLeft

		const leftDiff = Math.abs(tileRect.left - emptyTileRect.left) > 0 && Math.abs(tileRect.left - emptyTileRect.left) <= tileWidth + 1 && inTop


		if (!topDiff && !leftDiff) {
			inTransition = false
			return
		}

		t.style.transform = `translate(${emptyTileRect.left - tileRect.left}px, ${emptyTileRect.top - tileRect.top}px)`
		emptyTile.style.transform = `translate(${tileRect.left - emptyTileRect.left}px, ${tileRect.top - emptyTileRect.top}px)`

		const tileIndex = tile.indexOf(t)
		const emptyIndex = tile.indexOf(emptyTile)

		await delay(200)

		tileContainer.insertBefore(t, tile[emptyIndex+1])
		tileContainer.insertBefore(emptyTile, tile[tileIndex+1])

		tile = Array.from(tileContainer.querySelectorAll('.tile'))

		t.style.transform = ''
		emptyTile.style.transform = ''
		await delay(100)
		
		await verifyWin()
		inTransition = false
	})
})


async function startGame() {
	if(inTransition) return
	inTransition = true
	
	buttonStart.style.transform = 'scale(0)'
	await delay(300)
	
	//tile = tile.sort(() => Math.random() - .5)
	tile.forEach(t => {
	//	tileContainer.appendChild(t)
	})
	
	isPlaying = true
	inTransition = false

	buttonStart.parentNode.style.display = 'none'
	timeContainer.style.visibility = 'visible'
	timeContainer.style.transform = 'scale(1)'
	
	intervalId = setInterval(updateTime, 1000)
	
}


function updateTime() {
	sec++

	if (hour > 0) {
		time.textContent = `${hour}:${min > 9 ? min: '0' + min }:${sec > 9 ? sec: '0' + sec }`
	} else {
		time.textContent = `${min}:${sec > 9 ? sec: '0' + sec}`
	}

	if (sec >= 60) {
		sec = 0
		min++

		if (min >= 60) {
			min = 0
			hour++
		}
	}
}


async function retry() {
	if(inTransition) return
	inTransition = true
	
	emptyTile.style.opacity = 0
	emptyTile.style.filter = 'brightness(120%)'
	emptyTile.style.filter.boxShadow = '0px 0px 2px 2px rgba(255, 255, 255, .5)'
	
	divVictory.style.transform = 'translate(-50%, -50%) scale(.1)'
	await delay(300)
	
	divVictory.style.visibility = 'hidden'

	sec = min = hour = 0
	
	inTransition = false
	startGame()
}


async function verifyWin() {
	for (const [index, t] of tile.entries()) {
		if (Number(t.textContent) !== index+1) {
			break
		}

		if (index+1 === tile.length) {
			isPlaying = false
			clearInterval(intervalId)

			emptyTile.style.opacity = 1
			await delay(1100)

			emptyTile.style.filter = 'brightness(100%)'
			emptyTile.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.3)'
			await delay(400)

			await setRecord()

			divVictory.style.visibility = 'visible'
			divVictory.style.transform = 'translate(-50%, -50%) scale(1)'
			timeContainer.style.visibility = 'hidden'
		}
	}
}


function setRecord() {
	record.textContent = time.textContent
	titleRecord.textContent = 'Seu Tempo'

	const best = bestRecord.textContent ? bestRecord.textContent.split(':') : null

	
	if(!best) {
		titleRecord.textContent = 'Novo Recorde'
		bestRecord.textContent = time.textContent
		return
	}
	
	if (hour === 0) best.unshift('0')

	if (hour < Number(best[0])) {
		titleRecord.textContent = 'Novo Recorde'
		bestRecord.textContent = time.textContent
	} else if (hour === Number(best[0]) && min < Number(best[1])) {
		titleRecord.textContent = 'Novo Recorde'
		bestRecord.textContent = time.textContent
	} else if (min === Number(best[1]) && sec < Number(best[2])) {
		titleRecord.textContent = 'Novo Recorde'
		bestRecord.textContent = time.textContent
	}		
}


async function showCredit() {
	divCredit.style.visibility = 'visible'
	divCredit.style.opacity = 1
	await delay(300)
	
	document.addEventListener('click', closeCredit)
}

async function closeCredit(e) {
	if(creditContainer.contains(e.target)) return
	
	document.removeEventListener('click', closeCredit)
	divCredit.style.opacity = 0
	await delay(300)
	divCredit.style.visibility = 'hidden'
}


function delay(ms) {
	return new Promise(resolve => setTimeout(resolve,
		ms))
}

buttonRetry.onclick = retry
buttonStart.onclick = startGame
buttonCredit.onclick = showCredit