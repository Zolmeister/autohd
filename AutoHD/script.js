const $ = document.querySelector.bind(document)

const waitFor = (selector, $$ = $, cnt = 0) => {
	return new Promise((resolve, reject) => setTimeout(_ => {
		const res = $$(selector)
		if (res == null) {
			if (cnt > 3) {
				reject(new Error(`${selector} not found`))
			} else {
				resolve(waitFor(selector, $$, cnt + 1))
			}
		}
		else
		 	resolve(res)
	}, 100))
}

const waitForAny = (selector) => waitFor(selector, document.querySelectorAll.bind(document));

const getQualityButton = async function() {
	const find = async function() {
		return Array.from(await waitForAny('.ytp-menuitem-label')).find(x => x.innerHTML === 'Quality')
	}
	let found = await find()
	let cnt = 0
	while (!found && cnt < 3) {
		(await waitFor('.ytp-settings-button')).click()
		found = await find()
		cnt += 1
	}
	if (!found) {
		throw new Error('settings button not found')
	}
	return found
}

const getQuality = async function() {
	return (await getQualityButton()).parentElement.querySelector('.ytp-menuitem-content').textContent
}

const getMaxQuality = async function() {
	if (!$('.ytp-quality-menu')) {
		(await getQualityButton()).click()
	}
	const res = (await waitFor('.ytp-quality-menu .ytp-menuitem-label')).textContent
	await closeSettings()
	return res
}

const closeSettings = async function() {
	const button = await waitFor('.ytp-settings-button')
	if (button.ariaExpanded === 'true') {
		button.click()
	}
}

const setQualityToMax = async function() {
	if (!$('.ytp-quality-menu')) {
		(await getQualityButton()).click()
	}
	(await waitFor('.ytp-quality-menu .ytp-menuitem-label')).click()
}

const isFeatured = _ => new RegExp("^\/(user|channel|c|u)\/").test(window.location.pathname)

const update = async function(maxQuality) {
	const currentQuality = await getQuality()

	if (isFeatured() && !!$('video')) {
		$('video').muted = true
	} else if (!!$('video')) {
		$('video').muted = false
	}

	if (!currentQuality.includes(maxQuality)) {
		console.log('AutoHD: from', currentQuality, 'to', maxQuality)
		return setQualityToMax()
	}
}

;((async function() {
	let maxQuality = await getMaxQuality()
	let disabled = false

	const bindButton = async function() {
		const button = await waitFor('.ytp-settings-button')
		button.onclick = _ => {
			disabled = true
			setTimeout(_ => disabled = false, 10000)
		}
	}
	bindButton().catch(console.error)

	window.addEventListener('popstate', _ => {
		getMaxQuality().then(x => maxQuality = x).catch(console.error)
		bindButton().catch(console.error)
	})

	const loop = _ => {
		if (disabled) {
			return setTimeout(_ => loop, 200)
		}
		update(maxQuality).then(_ => setTimeout(loop, 200)).catch(console.error)
	}

	loop()
})()).catch(console.error)
