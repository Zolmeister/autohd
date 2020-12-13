let disabledTimeout = null
const loop = _ => {
  closedButton = document.querySelector('.ytmusic-you-there-renderer .yt-button-renderer')
  if (closedButton && !disabledTimeout) {
    console.log('AutoHD music: Awaken!')
    closedButton.click()
  }
  setTimeout(loop, 100)
}

console.log('AutoHD: starting awake loop')
loop()

window.addEventListener('click', _ => {
  console.log('AutoHD music: disabled');
  if (disabledTimeout) {
    clearTimeout(disabledTimeout)
  }
  disabledTimeout = setTimeout(_ => {
    console.log('AutoHD music: enabled');
    disabledTimeout = null
  }, 5000)
})
