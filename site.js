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

const topnav = document.querySelector('.topnav');
const sectionLinks = [...document.querySelectorAll('.topnav-links a')].flatMap((link) => {
  const url = new URL(link.href, window.location.href);
  const target = url.pathname === window.location.pathname && url.hash
    ? document.getElementById(decodeURIComponent(url.hash.slice(1)))
    : null;

  return target ? [{ link, target }] : [];
});

if (topnav && sectionLinks.length) {
  let scrollFrame = 0;

  const updateCurrentSection = () => {
    scrollFrame = 0;
    const activeLine = topnav.getBoundingClientRect().bottom + 24;
    let current = sectionLinks[0];

    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = sectionLinks[sectionLinks.length - 1];
    } else {
      for (const section of sectionLinks) {
        if (section.target.getBoundingClientRect().top <= activeLine) {
          current = section;
        } else {
          break;
        }
      }
    }

    for (const { link } of sectionLinks) {
      const isCurrent = link === current.link;
      link.classList.toggle('active', isCurrent);
      if (isCurrent) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  };

  const scheduleSectionUpdate = () => {
    if (!scrollFrame) {
      scrollFrame = window.requestAnimationFrame(updateCurrentSection);
    }
  };

  window.addEventListener('scroll', scheduleSectionUpdate, { passive: true });
  window.addEventListener('resize', scheduleSectionUpdate);
  window.addEventListener('hashchange', scheduleSectionUpdate);
  updateCurrentSection();
}

const album = document.querySelector('.secret-album');
const tracklist = document.querySelector('.track-whispers');
const tracklistToggle = document.querySelector('.tracklist-toggle');

if (album && tracklist && tracklistToggle) {
  tracklistToggle.addEventListener('click', () => {
    const isExpanded = tracklistToggle.getAttribute('aria-expanded') === 'true';
    tracklistToggle.setAttribute('aria-expanded', String(!isExpanded));
    tracklistToggle.textContent = isExpanded ? 'Odhalit tracklist' : 'Skrýt tracklist';
    tracklist.setAttribute('aria-hidden', String(isExpanded));
    album.classList.toggle('is-tracks-revealed', !isExpanded);
  });
}

if (album) {
  const setAlbumPointerPosition = (event) => {
    if (event.pointerType === 'touch') return;

    const bounds = album.getBoundingClientRect();
    const pointerX = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const pointerY = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));

    album.style.setProperty('--album-pointer-x', `${pointerX * 100}%`);
    album.style.setProperty('--album-pointer-y', `${pointerY * 100}%`);
    album.classList.add('is-illuminated');
  };

  album.addEventListener('pointermove', setAlbumPointerPosition);
  album.addEventListener('pointerleave', () => {
    album.style.setProperty('--album-pointer-x', '50%');
    album.style.setProperty('--album-pointer-y', '50%');
    album.classList.remove('is-illuminated');
  });
}
