const topnavMenu = document.querySelector('.topnav-menu');

if (topnavMenu) {
  let topnavCloseTimer;

  topnavMenu.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') {
      clearTimeout(topnavCloseTimer);
      topnavMenu.open = true;
    }
  });
  topnavMenu.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') {
      topnavCloseTimer = setTimeout(() => {
        topnavMenu.open = false;
      }, 220);
    }
  });
}
