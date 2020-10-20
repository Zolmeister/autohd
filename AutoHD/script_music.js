const loop = _ => {
  closedButton = document.querySelector('.ytmusic-you-there-renderer .yt-button-renderer')
  if (closedButton) {
    const {width, height, x, y} = closedButton.getBoundingClientRect()
    if (x | y | width | height) {
      console.log('AutoHD: Awaken!')
      closedButton.click()
    }
  }
  setTimeout(loop, 100)
}

console.log('AutoHD: starting awake loop')
loop()
