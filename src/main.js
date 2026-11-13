import * as Astronomy from 'astronomy-engine';
import { createIcons, icons as lucideIcons } from 'lucide';
import './styles.css';

const refreshIcons = () => createIcons({ icons: lucideIcons });

const CITIES = [
  { id: 'addis', name: 'Addis Ababa', country: 'Ethiopia', lat: 8.9806, lon: 38.7578, elevation: 2355, utcOffset: 3 },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', lat: -1.2921, lon: 36.8219, elevation: 1795, utcOffset: 3 },
  { id: 'london', name: 'London', country: 'United Kingdom', lat: 51.5072, lon: -0.1276, elevation: 11, utcOffset: 1 },
  { id: 'new-york', name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006, elevation: 10, utcOffset: -4 },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, elevation: 40, utcOffset: 9 },
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, elevation: 58, utcOffset: 10 },
];

const STAR_DATA = [
  { id: 'sirius', name: 'Sirius', ra: 6.7525, dec: -16.7161, magnitude: -1.46, distance: '8.6 ly', constellation: 'Canis Major', spectral: 'A1V', color: '#d8e6ff', story: 'Sirius appears exceptionally bright because it is relatively close to Earth and has high intrinsic luminosity. Its name comes from the Greek word for glowing or scorching.', hook: 'The brightest star in Earth\'s night sky.' },
  { id: 'betelgeuse', name: 'Betelgeuse', ra: 5.9195, dec: 7.4071, magnitude: 0.42, distance: '642 ly', constellation: 'Orion', spectral: 'M1-M2 Ia-ab', color: '#ff9c78', story: 'Betelgeuse is a red supergiant so large that, placed at the Sun, its outer atmosphere would reach beyond the orbit of Mars. It is also a variable star, subtly changing its brightness over time.', hook: 'A red supergiant at the shoulder of Orion.' },
  { id: 'rigel', name: 'Rigel', ra: 5.2423, dec: -8.2016, magnitude: 0.13, distance: '860 ly', constellation: 'Orion', spectral: 'B8 Ia', color: '#b8d4ff', story: 'Rigel is a blue supergiant and the brightest star in Orion. Its blue-white light is a clue to its much hotter surface than the red stars nearby.', hook: 'The blue-white foot of Orion.' },
  { id: 'bellatrix', name: 'Bellatrix', ra: 5.4189, dec: 6.3497, magnitude: 1.64, distance: '250 ly', constellation: 'Orion', spectral: 'B2 III', color: '#b9d6ff', story: 'Bellatrix marks Orion\'s western shoulder. Its name means female warrior in Latin, a fitting title for a star in the constellation of the hunter.', hook: 'The warrior star on Orion\'s shoulder.' },
  { id: 'saiph', name: 'Saiph', ra: 5.7959, dec: -9.6696, magnitude: 2.07, distance: '720 ly', constellation: 'Orion', spectral: 'B0.5 Ia', color: '#bdd8ff', story: 'Saiph forms one of Orion\'s two bright feet. It is a hot blue supergiant, even though its low position in the pattern can make it feel less prominent than Rigel.', hook: 'A hot blue star at Orion\'s other foot.' },
  { id: 'alnilam', name: 'Alnilam', ra: 5.6036, dec: -1.2019, magnitude: 1.69, distance: '1,340 ly', constellation: 'Orion', spectral: 'B0 Ia', color: '#b9d5ff', story: 'Alnilam is the central jewel of Orion\'s Belt. It is one of the most luminous stars known, shining thousands of times more brightly than the Sun.', hook: 'The middle jewel in Orion\'s Belt.' },
  { id: 'alnitak', name: 'Alnitak', ra: 5.6793, dec: -1.9426, magnitude: 1.74, distance: '1,260 ly', constellation: 'Orion', spectral: 'O9.5 Ib', color: '#b2d3ff', story: 'Alnitak is the easternmost star of Orion\'s Belt. Near it sits the Horsehead Nebula, a dark cloud silhouetted against glowing hydrogen.', hook: 'The first star in Orion\'s Belt.' },
  { id: 'mintaka', name: 'Mintaka', ra: 5.5334, dec: -0.2991, magnitude: 2.23, distance: '1,200 ly', constellation: 'Orion', spectral: 'O9.5 II', color: '#c6dcff', story: 'Mintaka is the westernmost star of Orion\'s Belt. The name traces back to an Arabic phrase meaning the belt of the giant.', hook: 'The western star in Orion\'s Belt.' },
  { id: 'procyon', name: 'Procyon', ra: 7.655, dec: 5.225, magnitude: 0.34, distance: '11.5 ly', constellation: 'Canis Minor', spectral: 'F5 IV-V', color: '#fff3cf', story: 'Procyon means before the dog in Greek because it rises shortly before Sirius. Together they make the small constellation Canis Minor.', hook: 'The little dog that rises before Sirius.' },
  { id: 'aldebaran', name: 'Aldebaran', ra: 4.5987, dec: 16.5093, magnitude: 0.85, distance: '65 ly', constellation: 'Taurus', spectral: 'K5 III', color: '#ffbf8e', story: 'Aldebaran is the orange eye of Taurus. It appears to sit inside the Hyades cluster, but it is actually much closer to us than those cluster stars.', hook: 'The orange eye of Taurus the Bull.' },
  { id: 'vega', name: 'Vega', ra: 18.6156, dec: 38.7837, magnitude: 0.03, distance: '25 ly', constellation: 'Lyra', spectral: 'A0V', color: '#dce9ff', story: 'Vega was one of the first stars to be photographed and has long served astronomers as a brightness reference. It anchors the Summer Triangle.', hook: 'A blue-white anchor of the Summer Triangle.' },
  { id: 'arcturus', name: 'Arcturus', ra: 14.261, dec: 19.182, magnitude: -0.05, distance: '36.7 ly', constellation: 'Boötes', spectral: 'K1.5 III', color: '#ffc28e', story: 'Arcturus is an aging orange giant and the brightest star in the northern celestial hemisphere. Follow the curve of the Big Dipper\'s handle to find it.', hook: 'Follow the arc to this orange giant.' },
  { id: 'capella', name: 'Capella', ra: 5.2782, dec: 45.998, magnitude: 0.08, distance: '42.9 ly', constellation: 'Auriga', spectral: 'G8 III', color: '#fff0bb', story: 'Capella is a system of four stars, with two giant stars dominating its light. Its name means little she-goat, a reference to the nearby kids in Auriga.', hook: 'A golden pair in the Charioteer.' },
  { id: 'antares', name: 'Antares', ra: 16.4901, dec: -26.4319, magnitude: 1.09, distance: '550 ly', constellation: 'Scorpius', spectral: 'M1.5 Iab-Ib', color: '#ff9a79', story: 'Antares means rival of Mars because its red color can resemble the planet. It is a red supergiant near the heart of Scorpius.', hook: 'The red rival of Mars.' },
  { id: 'spica', name: 'Spica', ra: 13.4199, dec: -11.1614, magnitude: 0.98, distance: '250 ly', constellation: 'Virgo', spectral: 'B1 III-IV', color: '#c6ddff', story: 'Spica is a close binary system whose stars orbit each other in only four days. It marks a sheaf of wheat held by Virgo.', hook: 'A bright binary in the hand of Virgo.' },
  { id: 'deneb', name: 'Deneb', ra: 20.6905, dec: 45.2803, magnitude: 1.25, distance: '2,600 ly', constellation: 'Cygnus', spectral: 'A2 Ia', color: '#dce9ff', story: 'Deneb is one of the most luminous stars visible to the naked eye. It forms the tail of Cygnus and one corner of the Summer Triangle.', hook: 'A distant luminous star in the Swan.' },
  { id: 'altair', name: 'Altair', ra: 19.8464, dec: 8.8683, magnitude: 0.77, distance: '16.7 ly', constellation: 'Aquila', spectral: 'A7 V', color: '#e1eaff', story: 'Altair spins so quickly that its equator bulges outward. Along with Vega and Deneb, it forms the easy-to-spot Summer Triangle.', hook: 'The nearby, fast-spinning eagle star.' },
  { id: 'polaris', name: 'Polaris', ra: 2.5303, dec: 89.2641, magnitude: 1.98, distance: '433 ly', constellation: 'Ursa Minor', spectral: 'F7 Ib-II', color: '#fff4d1', story: 'Polaris lies close to the north celestial pole, so it appears almost fixed while the rest of the sky circles around it. It is a triple-star system.', hook: 'The north star, almost fixed in the sky.' },
  { id: 'canopus', name: 'Canopus', ra: 6.3992, dec: -52.6957, magnitude: -0.74, distance: '310 ly', constellation: 'Carina', spectral: 'A9 II', color: '#fff0bd', story: 'Canopus is the second-brightest star in the night sky. Its low southern path makes it a special sight for observers at mid-northern latitudes.', hook: 'The second-brightest star in the night sky.' },
  { id: 'fomalhaut', name: 'Fomalhaut', ra: 22.9608, dec: -29.6222, magnitude: 1.16, distance: '25.1 ly', constellation: 'Piscis Austrinus', spectral: 'A3 V', color: '#dbe8ff', story: 'Fomalhaut is surrounded by a dusty debris disk shaped by young planets and planetesimals. It is the lonely bright eye of the Southern Fish.', hook: 'A bright eye surrounded by a dusty disk.' },
];

const CONSTELLATIONS = [
  { id: 'orion', name: 'Orion', subtitle: 'The Hunter', color: '#eabf77', stars: ['betelgeuse', 'bellatrix', 'alnilam', 'alnitak', 'mintaka', 'rigel', 'saiph'], segments: [['betelgeuse', 'bellatrix'], ['bellatrix', 'alnilam'], ['alnilam', 'alnitak'], ['alnilam', 'mintaka'], ['betelgeuse', 'alnitak'], ['bellatrix', 'rigel'], ['alnitak', 'saiph'], ['rigel', 'saiph']], story: 'In Greek mythology, Orion was a giant hunter. The familiar hourglass is an observational pattern: the stars appear together from Earth, but they sit at very different distances.' },
  { id: 'summer-triangle', name: 'Summer Triangle', subtitle: 'Asterism', color: '#a6c9d3', stars: ['vega', 'deneb', 'altair'], segments: [['vega', 'deneb'], ['deneb', 'altair'], ['altair', 'vega']], story: 'The Summer Triangle is an asterism rather than a single constellation. Its three bright stars cross the boundaries of Lyra, Cygnus, and Aquila.' },
  { id: 'scorpius', name: 'Scorpius', subtitle: 'The Scorpion', color: '#db8777', stars: ['antares'], segments: [], story: 'Antares anchors the curved heart of Scorpius. The full scorpion stretches farther across the southern sky, with a tail that curls toward the horizon.' },
];

const PLANETS = [
  { id: 'mercury', name: 'Mercury', body: Astronomy.Body.Mercury, glyph: '●', color: '#c9b39a', magnitude: 0.3, story: 'Mercury is the smallest planet and the closest to the Sun. It stays low near the horizon, so a clear view matters.' },
  { id: 'venus', name: 'Venus', body: Astronomy.Body.Venus, glyph: '◌', color: '#ead39a', magnitude: -4.2, story: 'Venus is wrapped in bright clouds of sulfuric acid. Its brilliance comes from both its reflective clouds and its relative closeness to Earth.' },
  { id: 'mars', name: 'Mars', body: Astronomy.Body.Mars, glyph: '♂', color: '#e89172', magnitude: 1.1, story: 'Mars gets its rust-red color from iron minerals in its surface dust. Its slow movement against the stars made it a wandering light to ancient observers.' },
  { id: 'jupiter', name: 'Jupiter', body: Astronomy.Body.Jupiter, glyph: '♃', color: '#e3bd8a', magnitude: -2.2, story: 'Jupiter is the largest planet in the Solar System. Even through binoculars, its four brightest moons can appear as tiny points beside it.' },
  { id: 'saturn', name: 'Saturn', body: Astronomy.Body.Saturn, glyph: '♄', color: '#d7c28d', magnitude: 0.7, story: 'Saturn\'s rings are made of countless pieces of ice and rock. At the right magnification, the planet turns a point of light into a world.' },
];

const state = {
  city: CITIES[0],
  date: '2026-09-06',
  time: '21:00',
  sky: null,
  selectedId: 'sirius',
  viewAzimuth: 180,
  zoom: 1,
  layers: { constellations: true, planets: true, grid: true, labels: true },
  searchTerm: '',
  modal: null,
  shareContext: null,
  birthData: { date: '2001-06-18', time: '23:00', city: CITIES[0] },
};

const app = document.querySelector('#app');

function localDateToUtc(dateString, timeString, utcOffset) {
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);
  return new Date(Date.UTC(year, month - 1, day, hours - utcOffset, minutes));
}

function formatDate(dateString, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(new Date(`${dateString}T12:00:00Z`));
}

function formatTime(timeString) {
  const [hour, minute] = timeString.split(':').map(Number);
  const date = new Date(Date.UTC(2020, 0, 1, hour, minute));
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(date);
}

function formatAzimuth(azimuth) {
  const labels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return labels[Math.round(((azimuth % 360) + 360) % 360 / 45) % 8];
}

function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

function signedAngle(angle) {
  const normalized = normalizeAngle(angle);
  return normalized > 180 ? normalized - 360 : normalized;
}

function objectEquator(body, date, observer) {
  const eq = Astronomy.Equator(body, date, observer, true, true);
  const horizontal = Astronomy.Horizon(date, observer, eq.ra, eq.dec, 'normal');
  return { ...horizontal, distanceAu: eq.dist, ra: eq.ra, dec: eq.dec };
}

function moonPhaseLabel(phaseFraction, phaseAngle) {
  const angle = normalizeAngle(phaseAngle);
  if (phaseFraction < 0.03) return 'New moon';
  if (phaseFraction > 0.97) return 'Full moon';
  if (angle < 90) return 'Waxing crescent';
  if (angle < 180) return 'Waxing gibbous';
  if (angle < 270) return 'Waning gibbous';
  return 'Waning crescent';
}

function buildSky() {
  const city = state.city;
  const date = localDateToUtc(state.date, state.time, city.utcOffset);
  const observer = new Astronomy.Observer(city.lat, city.lon, city.elevation);
  const sun = objectEquator(Astronomy.Body.Sun, date, observer);
  const moon = objectEquator(Astronomy.Body.Moon, date, observer);
  const moonIllumination = Astronomy.Illumination(Astronomy.Body.Moon, date);
  const planets = PLANETS.map((planet) => {
    const position = objectEquator(planet.body, date, observer);
    const illumination = Astronomy.Illumination(planet.body, date);
    return { ...planet, ...position, magnitude: illumination.mag };
  });
  const stars = STAR_DATA.map((star, index) => {
    const bodyName = Astronomy.Body[`Star${(index % 8) + 1}`];
    Astronomy.DefineStar(bodyName, star.ra, star.dec, Number.parseFloat(star.distance) || 1000);
    const position = objectEquator(bodyName, date, observer);
    return { ...star, ...position, type: 'star' };
  });
  const darkness = sun.altitude < -18 ? 'Night' : sun.altitude < -12 ? 'Astronomical twilight' : sun.altitude < -6 ? 'Nautical twilight' : sun.altitude < 0 ? 'Civil twilight' : 'Daylight';
  const moonPhase = moonPhaseLabel(moonIllumination.phase_fraction, moonIllumination.phase_angle);
  const objects = [
    ...stars,
    ...planets.map((planet) => ({ ...planet, type: 'planet' })),
    { id: 'moon', name: 'Moon', type: 'moon', ...moon, magnitude: -12.6, color: '#f4dfb0', glyph: '☾', story: `The Moon is ${Math.round(moonIllumination.phase_fraction * 100)}% illuminated tonight. Its topocentric position is calculated for ${city.name}, including the small shift caused by lunar parallax.`, hook: `${moonPhase} · ${Math.round(moonIllumination.phase_fraction * 100)}% illuminated`, phase: moonPhase, illumination: moonIllumination.phase_fraction },
    { id: 'sun', name: 'Sun', type: 'sun', ...sun, magnitude: -26.7, color: '#f3bd68', glyph: '☼', story: 'The Sun is the star at the center of our Solar System. Its altitude determines the sky\'s twilight state and the overall tone of this view.', hook: darkness },
  ];
  const constellationVisibility = CONSTELLATIONS.map((constellation) => {
    const members = constellation.stars.map((id) => stars.find((star) => star.id === id)).filter(Boolean);
    const visibleMembers = members.filter((star) => star.altitude > 0);
    return { ...constellation, members, visibleMembers, visibility: visibleMembers.length / Math.max(members.length, 1) };
  });
  const highlights = [
    ...objects.filter((object) => ['planet', 'moon', 'star'].includes(object.type) && object.altitude > 10).sort((a, b) => (b.type === 'planet') - (a.type === 'planet') || a.magnitude - b.magnitude).slice(0, 5),
    ...constellationVisibility.filter((constellation) => constellation.visibility >= 0.65).slice(0, 2),
  ].slice(0, 5);
  state.sky = { date, observer, sun, moon, moonIllumination, planets, stars, objects, constellations: constellationVisibility, darkness, moonPhase, highlights };
  if (!state.sky.objects.some((object) => object.id === state.selectedId)) state.selectedId = 'sirius';
  return state.sky;
}

function getSelectedObject() {
  if (!state.sky) return null;
  const object = state.sky.objects.find((item) => item.id === state.selectedId);
  if (object) return object;
  return state.sky.constellations.find((item) => item.id === state.selectedId) || null;
}

function visibilityText(object) {
  if (!object) return 'Not selected';
  if (object.visibility !== undefined) return object.visibility > 0.65 ? 'Visible tonight' : object.visibility > 0 ? 'Partly visible' : 'Below the horizon';
  if (object.altitude > 15) return 'Excellent visibility';
  if (object.altitude > 5) return 'Good visibility';
  if (object.altitude > 0) return 'Low in the sky';
  return 'Below the horizon';
}

function renderShell() {
  const locationOptions = [...(state.city.id === 'current' ? [state.city] : []), ...CITIES];
  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <a class="brand" href="#" aria-label="SkyLore home">
          <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="brand-copy"><strong>SKYLORE</strong><small>PERSONAL ASTRONOMY</small></span>
        </a>
        <nav class="topnav" aria-label="Primary navigation">
          <button class="nav-link active" data-action="tonight">Tonight's sky</button>
          <button class="nav-link" data-action="birth-sky">Birth sky</button>
          <button class="nav-link" data-action="constellation">Constellations</button>
        </nav>
        <div class="top-actions">
          <button class="icon-button" data-action="locate" title="Use my location" aria-label="Use my location"><i data-lucide="locate-fixed"></i></button>
          <button class="outline-button" data-action="share" aria-label="Share this sky"><i data-lucide="share-2"></i><span>Share this sky</span></button>
          <button class="mobile-menu icon-button" data-action="menu" title="Open menu" aria-label="Open menu"><i data-lucide="sliders-horizontal"></i></button>
        </div>
      </header>

      <main class="workspace">
        <aside class="control-rail">
          <div class="rail-heading">
            <div>
              <span class="eyebrow">Your sky</span>
              <h1>Look up.<br /><em>Know what you see.</em></h1>
            </div>
            <span class="live-dot" title="Sky calculation ready"></span>
          </div>

          <section class="control-section location-section">
            <div class="section-label"><span>Location</span><button class="text-button" data-action="locate"><i data-lucide="locate-fixed"></i> Use mine</button></div>
            <label class="select-wrap" for="city-select">
              <i data-lucide="map-pin"></i>
              <select id="city-select" aria-label="Choose location">
                ${locationOptions.map((city) => `<option value="${city.id}" ${city.id === state.city.id ? 'selected' : ''}>${city.name}, ${city.country}</option>`).join('')}
              </select>
              <i data-lucide="chevron-down"></i>
            </label>
            <div class="coordinate-line">${state.city.lat.toFixed(4)}° ${state.city.lat >= 0 ? 'N' : 'S'} <span></span> ${Math.abs(state.city.lon).toFixed(4)}° ${state.city.lon >= 0 ? 'E' : 'W'} <span></span> ${state.city.elevation.toLocaleString()} m</div>
          </section>

          <section class="control-section date-section">
            <div class="section-label"><span>When</span><button class="text-button" data-action="now"><i data-lucide="clock-3"></i> Now</button></div>
            <div class="field-row">
              <label class="field-control"><i data-lucide="calendar-days"></i><input id="date-input" type="date" value="${state.date}" aria-label="Date" /></label>
              <label class="field-control"><i data-lucide="clock-3"></i><input id="time-input" type="time" value="${state.time}" aria-label="Time" /></label>
            </div>
            <button class="primary-button full-width" data-action="update"><span>Update sky</span><i data-lucide="arrow-up-right"></i></button>
          </section>

          <section class="control-section layers-section">
            <div class="section-label"><span>Layers</span><button class="icon-button tiny" data-action="reset-view" title="Reset sky view" aria-label="Reset sky view"><i data-lucide="rotate-ccw"></i></button></div>
            <div class="layer-list">
              ${layerControl('constellations', 'Constellations', 'Patterns in the sky')}
              ${layerControl('planets', 'Planets', 'Wanderers nearby')}
              ${layerControl('grid', 'Celestial grid', 'Altitude + azimuth')}
              ${layerControl('labels', 'Object labels', 'Names on the dome')}
            </div>
          </section>

          <div class="rail-footnote"><i data-lucide="circle-help"></i><span>Calculated with Astronomy Engine<br /><a href="https://github.com/cosinekitty/astronomy" target="_blank" rel="noreferrer">Learn about the science</a></span></div>
        </aside>

        <section class="sky-column">
          <div class="sky-header">
            <div><span class="eyebrow">Tonight's sky</span><h2>${state.city.name}<span> · </span>${formatDate(state.date)} <span>·</span> ${formatTime(state.time)}</h2></div>
            <div class="sky-condition"><span class="condition-icon ${state.sky?.darkness === 'Night' ? 'is-night' : ''}"></span><span>${state.sky?.darkness || 'Calculating'}</span></div>
          </div>
          <div class="sky-stage" id="sky-stage">
            <canvas id="sky-canvas" aria-label="Interactive sky map for ${state.city.name} on ${formatDate(state.date)} at ${formatTime(state.time)}"></canvas>
            <div class="stage-corner stage-corner-left"><span class="live-dot"></span><span>LIVE VIEW</span></div>
            <div class="stage-corner stage-corner-right"><span>${state.sky ? Math.round(state.sky.objects.filter((object) => object.altitude > 0).length) : 0} objects above horizon</span></div>
            <div class="constellation-badge" id="constellation-badge"><span class="badge-line"></span><strong>ORION</strong><span>THE HUNTER</span></div>
            <div class="sky-tooltip" id="sky-tooltip" hidden></div>
            <div class="stage-controls">
              <div class="compass-readout"><span class="compass-needle">N</span><span id="compass-label">SOUTH</span></div>
              <button class="stage-control" data-action="rotate-left" title="Turn sky left" aria-label="Turn sky left"><i data-lucide="chevron-left"></i></button>
              <button class="stage-control" data-action="rotate-right" title="Turn sky right" aria-label="Turn sky right"><i data-lucide="chevron-right"></i></button>
              <button class="stage-control" data-action="zoom-out" title="Zoom out" aria-label="Zoom out">−</button>
              <button class="stage-control" data-action="zoom-in" title="Zoom in" aria-label="Zoom in">+</button>
            </div>
            <div class="stage-search">
              <i data-lucide="search"></i><input id="search-input" type="search" placeholder="Find an object" autocomplete="off" aria-label="Find an object" value="${state.searchTerm}" /><kbd>/</kbd>
              <div class="search-results" id="search-results" hidden></div>
            </div>
          </div>
          <div class="sky-caption"><span>Drag to turn the dome</span><span class="caption-rule"></span><span>North is up in the compass</span><span class="caption-stat"><strong>${state.sky ? state.sky.stars.filter((star) => star.altitude > 0).length : 0}</strong> visible stars</span></div>
        </section>

        <aside class="story-column">
          <div class="story-column-head"><div><span class="eyebrow">What am I looking at?</span><h2 id="story-title">${getSelectedObject()?.name || 'Your sky'}</h2></div><button class="icon-button" data-action="clear-selection" title="Clear selection" aria-label="Clear selection"><i data-lucide="x"></i></button></div>
          <div id="story-panel"></div>
          <div class="highlights-section">
            <div class="section-label"><span>Tonight's highlights</span><button class="text-button" data-action="highlights">View all <i data-lucide="arrow-up-right"></i></button></div>
            <div class="highlight-list" id="highlight-list"></div>
          </div>
          <button class="share-banner" data-action="share"><span class="share-banner-icon"><i data-lucide="share-2"></i></span><span><strong>Make this sky yours</strong><small>Generate a story card for ${state.city.name}</small></span><i data-lucide="arrow-up-right"></i></button>
        </aside>
      </main>
      <div id="modal-root"></div>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
    </div>
  `;
  renderStoryPanel();
  renderHighlights();
  refreshIcons();
  bindEvents();
}

function layerControl(id, label, description) {
  return `<label class="layer-row"><span><strong>${label}</strong><small>${description}</small></span><input type="checkbox" data-layer="${id}" ${state.layers[id] ? 'checked' : ''} /><span class="toggle-ui"></span></label>`;
}

function renderStoryPanel() {
  const panel = document.querySelector('#story-panel');
  const title = document.querySelector('#story-title');
  const object = getSelectedObject();
  if (!panel || !title) return;
  title.textContent = object?.name || 'Your sky';
  if (!object) {
    panel.innerHTML = `<div class="empty-story"><span class="empty-orbit">✦</span><p>Select a point of light to open its story.</p></div>`;
    return;
  }
  if (object.visibility !== undefined) {
    panel.innerHTML = `
      <div class="story-hero constellation-story" style="--object-color:${object.color}">
        <div class="story-swatch constellation-swatch"><span></span><span></span><span></span></div>
        <div><span class="story-kicker">${object.subtitle || 'Constellation'}</span><h3>${object.name}</h3><p>${object.visibility > 0.65 ? 'A familiar pattern is taking shape above you.' : 'Part of this pattern is above your horizon.'}</p></div>
      </div>
      <div class="story-fact-grid"><div><span>Visible stars</span><strong>${object.visibleMembers.length} / ${object.members.length}</strong></div><div><span>Best viewed</span><strong>Tonight</strong></div></div>
      <div class="story-copy"><span class="story-kicker">The story</span><p>${object.story}</p></div>
      <button class="secondary-button full-width" data-action="share"><i data-lucide="share-2"></i> Share this pattern</button>`;
  } else {
    const isPlanet = object.type === 'planet';
    const isMoon = object.type === 'moon';
    const isSun = object.type === 'sun';
    panel.innerHTML = `
      <div class="story-hero" style="--object-color:${object.color || '#e9c47c'}">
        <div class="story-swatch ${object.type}">${isPlanet || isMoon || isSun ? object.glyph : '<span></span><span></span><span></span>'}</div>
        <div><span class="story-kicker">${isPlanet ? 'Planet' : isMoon ? object.phase : isSun ? 'Our star' : object.constellation}</span><h3>${object.name}</h3><p>${object.hook}</p></div>
      </div>
      <div class="story-fact-grid"><div><span>Direction</span><strong>${formatAzimuth(object.azimuth)}</strong></div><div><span>Altitude</span><strong>${Math.round(object.altitude)}°</strong></div></div>
      <div class="story-fact-grid"><div><span>Visibility</span><strong>${visibilityText(object)}</strong></div><div><span>${isPlanet ? 'Magnitude' : 'Distance'}</span><strong>${isPlanet ? object.magnitude.toFixed(1) : object.distance || 'Local'}</strong></div></div>
      <div class="story-copy"><span class="story-kicker">Why it matters</span><p>${object.story}</p></div>
      ${object.constellation ? `<button class="inline-link" data-action="constellation" data-constellation="${object.constellation}">Explore ${object.constellation} <i data-lucide="arrow-up-right"></i></button>` : ''}
      <button class="secondary-button full-width" data-action="share"><i data-lucide="share-2"></i> Share ${object.name}</button>`;
  }
  refreshIcons();
}

function renderHighlights() {
  const list = document.querySelector('#highlight-list');
  if (!list || !state.sky) return;
  list.innerHTML = state.sky.highlights.map((object) => {
    const isConstellation = object.visibility !== undefined;
    const meta = isConstellation ? `${Math.round(object.visibility * 100)}% of pattern visible` : `${formatAzimuth(object.azimuth)} · ${Math.round(object.altitude)}° high`;
    return `<button class="highlight-row ${object.id === state.selectedId ? 'active' : ''}" data-select="${object.id}"><span class="highlight-symbol" style="--object-color:${object.color || '#e9c47c'}">${isConstellation ? '✦' : object.glyph || '✦'}</span><span><strong>${object.name}</strong><small>${meta}</small></span><i data-lucide="arrow-up-right"></i></button>`;
  }).join('');
  refreshIcons();
}

function renderModal() {
  const root = document.querySelector('#modal-root');
  if (!root) return;
  if (!state.modal) { root.innerHTML = ''; return; }
  if (state.modal === 'share') {
    const shareContext = state.shareContext || { city: state.city, date: state.date, time: state.time, title: 'YOUR SKY TONIGHT', selected: getSelectedObject() };
    root.innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal-panel share-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" data-modal-content><button class="modal-close icon-button" data-action="close-modal" title="Close" aria-label="Close"><i data-lucide="x"></i></button><div class="modal-heading"><span class="eyebrow">${shareContext.title}</span><h2 id="modal-title">Share ${shareContext.city.name}</h2><p>${formatDate(shareContext.date)} · ${formatTime(shareContext.time)}</p></div><canvas id="share-canvas" class="share-preview" width="1200" height="675"></canvas><div class="modal-actions"><button class="outline-button" data-action="download-share"><i data-lucide="download"></i> Download image</button><button class="primary-button" data-action="share-x"><span>Share on X</span><i data-lucide="arrow-up-right"></i></button></div><p class="modal-note">${shareContext.selected?.name || 'The sky'} is waiting above ${shareContext.city.name}.</p></section></div>`;
    refreshIcons();
    drawShareCard();
  } else if (state.modal === 'birth') {
    root.innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="birth-title" data-modal-content><button class="modal-close icon-button" data-action="close-modal" title="Close" aria-label="Close"><i data-lucide="x"></i></button><div class="modal-heading"><span class="eyebrow">A sky with your name on it</span><h2 id="birth-title">Your birth sky</h2><p>Look back to the sky above you when your story began.</p></div><div class="birth-form"><label><span>Date</span><input id="birth-date" type="date" value="${state.birthData.date}" /></label><label><span>Time</span><input id="birth-time" type="time" value="${state.birthData.time}" /></label><label class="birth-location"><span>Location</span><select id="birth-city">${CITIES.map((city) => `<option value="${city.id}" ${city.id === state.birthData.city.id ? 'selected' : ''}>${city.name}, ${city.country}</option>`).join('')}</select></label></div><button class="primary-button full-width" data-action="generate-birth"><span>Generate birth sky</span><i data-lucide="sparkles"></i></button></section></div>`;
    refreshIcons();
  } else if (state.modal === 'birth-result') {
    const birthCity = state.birthData.city;
    const birthDate = localDateToUtc(state.birthData.date, state.birthData.time, birthCity.utcOffset);
    const observer = new Astronomy.Observer(birthCity.lat, birthCity.lon, birthCity.elevation);
    const moon = objectEquator(Astronomy.Body.Moon, birthDate, observer);
    const moonIllumination = Astronomy.Illumination(Astronomy.Body.Moon, birthDate);
    const birthStars = STAR_DATA.map((star, index) => {
      const bodyName = Astronomy.Body[`Star${(index % 8) + 1}`];
      Astronomy.DefineStar(bodyName, star.ra, star.dec, Number.parseFloat(star.distance) || 1000);
      return { ...star, ...objectEquator(bodyName, birthDate, observer) };
    }).filter((star) => star.altitude > 10).sort((a, b) => a.magnitude - b.magnitude).slice(0, 3);
    root.innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal-panel birth-result" role="dialog" aria-modal="true" aria-labelledby="birth-result-title" data-modal-content><button class="modal-close icon-button" data-action="close-modal" title="Close" aria-label="Close"><i data-lucide="x"></i></button><div class="modal-heading"><span class="eyebrow">Your birth sky</span><h2 id="birth-result-title">The sky above ${birthCity.name}</h2><p>${formatDate(state.birthData.date)} · ${formatTime(state.birthData.time)}</p></div><div class="birth-sky-visual"><div class="birth-moon">☾</div><div class="birth-stars">${birthStars.map((star) => `<span style="--star-color:${star.color}" title="${star.name}"></span>`).join('')}</div><div class="birth-ring"></div></div><div class="birth-summary"><div><span>Moon</span><strong>${moonIllumination.phase_fraction > .5 ? 'Bright' : 'Quiet'} ${moonIllumination.phase_fraction * 100 | 0}%</strong></div><div><span>Brightest star</span><strong>${birthStars[0]?.name || 'None above 10°'}</strong></div><div><span>Constellation</span><strong>${birthStars[0]?.constellation || 'The open sky'}</strong></div></div><button class="primary-button full-width" data-action="birth-share"><i data-lucide="share-2"></i> Share my birth sky</button></section></div>`;
    refreshIcons();
  }
  bindModalEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-action]').forEach((element) => element.addEventListener('click', handleAction));
  document.querySelectorAll('[data-layer]').forEach((element) => element.addEventListener('change', (event) => {
    state.layers[event.target.dataset.layer] = event.target.checked;
    drawSky();
  }));
  document.querySelector('#city-select')?.addEventListener('change', (event) => {
    state.city = CITIES.find((city) => city.id === event.target.value) || CITIES[0];
    calculateAndRefresh();
  });
  document.querySelector('#date-input')?.addEventListener('change', (event) => { state.date = event.target.value; });
  document.querySelector('#time-input')?.addEventListener('change', (event) => { state.time = event.target.value; });
  const search = document.querySelector('#search-input');
  search?.addEventListener('input', (event) => { state.searchTerm = event.target.value; renderSearchResults(); });
  search?.addEventListener('keydown', (event) => { if (event.key === 'Enter') document.querySelector('.search-result')?.click(); });
  document.querySelectorAll('[data-select]').forEach((element) => element.addEventListener('click', () => selectObject(element.dataset.select)));
  setupCanvasInteractions();
}

function bindModalEvents() {
  document.querySelectorAll('[data-action]').forEach((element) => element.addEventListener('click', handleAction));
  document.querySelector('[data-modal-content]')?.addEventListener('click', (event) => event.stopPropagation());
  document.querySelector('#birth-city')?.addEventListener('change', (event) => { state.birthData.city = CITIES.find((city) => city.id === event.target.value) || CITIES[0]; });
  document.querySelector('#birth-date')?.addEventListener('change', (event) => { state.birthData.date = event.target.value; });
  document.querySelector('#birth-time')?.addEventListener('change', (event) => { state.birthData.time = event.target.value; });
}

function handleAction(event) {
  const action = event.currentTarget.dataset.action;
  if (action === 'update') calculateAndRefresh();
  if (action === 'now') {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    state.date = `${year}-${month}-${day}`;
    state.time = `${String((now.getUTCHours() + state.city.utcOffset + 24) % 24).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;
    calculateAndRefresh();
  }
  if (action === 'locate') requestBrowserLocation();
  if (action === 'menu') {
    const rail = document.querySelector('.control-rail');
    rail?.classList.toggle('mobile-open');
    if (rail?.classList.contains('mobile-open')) rail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (action === 'reset-view') { state.viewAzimuth = 180; state.zoom = 1; drawSky(); }
  if (action === 'rotate-left') { state.viewAzimuth = normalizeAngle(state.viewAzimuth - 20); drawSky(); }
  if (action === 'rotate-right') { state.viewAzimuth = normalizeAngle(state.viewAzimuth + 20); drawSky(); }
  if (action === 'zoom-in') { state.zoom = Math.min(1.5, state.zoom + 0.1); drawSky(); }
  if (action === 'zoom-out') { state.zoom = Math.max(0.8, state.zoom - 0.1); drawSky(); }
  if (action === 'clear-selection') { state.selectedId = null; renderStoryPanel(); renderHighlights(); drawSky(); }
  if (action === 'share') { state.shareContext = null; state.modal = 'share'; renderModal(); }
  if (action === 'birth-sky') { state.modal = 'birth'; renderModal(); }
  if (action === 'generate-birth') { state.modal = 'birth-result'; renderModal(); }
  if (action === 'birth-share') {
    state.shareContext = { city: state.birthData.city, date: state.birthData.date, time: state.birthData.time, title: 'YOUR BIRTH SKY', selected: { name: 'Your birth sky', hook: 'The sky above you when your story began.' } };
    state.modal = 'share';
    renderModal();
  }
  if (action === 'close-modal') { state.modal = null; state.shareContext = null; renderModal(); }
  if (action === 'share-x') shareOnX();
  if (action === 'download-share') downloadShareCard();
  if (action === 'constellation') {
    const targetName = event.currentTarget.dataset.constellation;
    const constellation = state.sky?.constellations.find((item) => item.name === targetName) || state.sky?.constellations.find((item) => item.id === 'orion');
    state.selectedId = constellation?.id || 'orion';
    renderStoryPanel(); renderHighlights(); drawSky();
  }
  if (action === 'highlights') showToast('Five highlights are above the horizon right now.');
}

function calculateAndRefresh() {
  buildSky();
  renderShell();
  drawSky();
  showToast(`Sky updated for ${state.city.name}`);
}

function requestBrowserLocation() {
  if (!navigator.geolocation) {
    showToast('This browser does not provide location access.');
    return;
  }
  showToast('Requesting your location...');
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    state.city = { id: 'current', name: 'Current location', country: 'Browser coordinates', lat: latitude, lon: longitude, elevation: position.coords.altitude || 0, utcOffset: -new Date().getTimezoneOffset() / 60 };
    calculateAndRefresh();
  }, () => showToast('Location access was not granted. Choose a city instead.'), { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
}

function selectObject(id) {
  state.selectedId = id;
  const object = state.sky?.objects.find((item) => item.id === id);
  if (object) state.viewAzimuth = object.azimuth;
  renderStoryPanel();
  renderHighlights();
  drawSky();
  document.querySelector('#search-results')?.setAttribute('hidden', '');
  const search = document.querySelector('#search-input');
  if (search) { search.value = ''; state.searchTerm = ''; }
}

function renderSearchResults() {
  const results = document.querySelector('#search-results');
  if (!results) return;
  const term = state.searchTerm.trim().toLowerCase();
  if (!term) { results.hidden = true; results.innerHTML = ''; return; }
  const matches = [...(state.sky?.objects || []), ...(state.sky?.constellations || [])].filter((object) => object.name.toLowerCase().includes(term) || object.constellation?.toLowerCase().includes(term)).sort((a, b) => Number(b.name.toLowerCase() === term) - Number(a.name.toLowerCase() === term)).slice(0, 6);
  results.innerHTML = matches.length ? matches.map((object) => `<button class="search-result" data-select="${object.id}"><span class="search-result-dot" style="--object-color:${object.color || '#e9c47c'}"></span><span><strong>${object.name}</strong><small>${object.type === 'planet' ? 'Planet' : object.type === 'star' ? object.constellation : object.subtitle || 'Constellation'}</small></span><i data-lucide="arrow-up-right"></i></button>`).join('') : '<div class="no-results">No object found in this sky.</div>';
  results.hidden = false;
  results.querySelectorAll('[data-select]').forEach((element) => element.addEventListener('click', () => selectObject(element.dataset.select)));
  refreshIcons();
}

function setupCanvasInteractions() {
  const canvas = document.querySelector('#sky-canvas');
  if (!canvas) return;
  let dragging = false;
  let lastX = 0;
  canvas.addEventListener('pointerdown', (event) => { dragging = true; lastX = event.clientX; canvas.setPointerCapture(event.pointerId); canvas.classList.add('is-dragging'); });
  canvas.addEventListener('pointermove', (event) => { if (!dragging) { updateCanvasHover(event); return; } const delta = event.clientX - lastX; lastX = event.clientX; state.viewAzimuth = normalizeAngle(state.viewAzimuth - delta * 0.35); drawSky(); });
  canvas.addEventListener('pointerup', (event) => { dragging = false; canvas.releasePointerCapture(event.pointerId); canvas.classList.remove('is-dragging'); });
  canvas.addEventListener('pointercancel', () => { dragging = false; canvas.classList.remove('is-dragging'); });
  canvas.addEventListener('click', (event) => { if (!canvas.dataset.dragged) { const hit = objectAtCanvasPoint(event); if (hit) selectObject(hit.id); } canvas.dataset.dragged = ''; });
  canvas.addEventListener('pointerleave', () => { document.querySelector('#sky-tooltip')?.setAttribute('hidden', ''); });
  window.addEventListener('resize', drawSky);
}

function canvasGeometry() {
  const canvas = document.querySelector('#sky-canvas');
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  return { canvas, width, height, dpr, cssWidth: rect.width, cssHeight: rect.height };
}

function projectObject(object, geometry) {
  const { width, height, dpr } = geometry;
  const centerX = width / 2;
  const centerY = height / 2 + 10 * dpr;
  const radius = Math.min(width, height) * 0.43 * state.zoom;
  const altitude = Math.max(-10, Math.min(90, object.altitude));
  const radial = radius * (90 - altitude) / 100;
  const delta = signedAngle(object.azimuth - state.viewAzimuth) * Math.PI / 180;
  return { x: centerX + radial * Math.sin(delta), y: centerY - radial * Math.cos(delta), radius, centerX, centerY, altitude };
}

function drawSky() {
  const geometry = canvasGeometry();
  if (!geometry || !state.sky) return;
  const { canvas, width, height, dpr } = geometry;
  const context = canvas.getContext('2d');
  const centerX = width / 2;
  const centerY = height / 2 + 10 * dpr;
  const radius = Math.min(width, height) * 0.43 * state.zoom;
  context.clearRect(0, 0, width, height);
  const skyGradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.18);
  skyGradient.addColorStop(0, state.sky.darkness === 'Daylight' ? '#31475e' : '#152437');
  skyGradient.addColorStop(0.55, state.sky.darkness === 'Night' ? '#0d1c30' : '#20354d');
  skyGradient.addColorStop(1, '#080d16');
  context.fillStyle = skyGradient;
  context.fillRect(0, 0, width, height);
  drawAtmosphere(context, centerX, centerY, radius, dpr);
  if (state.layers.grid) drawGrid(context, centerX, centerY, radius, dpr);
  if (state.layers.constellations) drawConstellations(context, geometry);
  drawStars(context, geometry);
  if (state.layers.planets) drawPlanets(context, geometry);
  drawHorizon(context, centerX, centerY, radius, dpr);
  updateCompassLabel();
  updateConstellationBadge();
}

function drawAtmosphere(context, centerX, centerY, radius, dpr) {
  context.save();
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  context.clip();
  const horizonGlow = context.createRadialGradient(centerX, centerY, radius * 0.45, centerX, centerY, radius * 1.08);
  horizonGlow.addColorStop(0, 'rgba(44, 84, 109, 0)');
  horizonGlow.addColorStop(0.7, state.sky.darkness === 'Night' ? 'rgba(63, 104, 122, 0.06)' : 'rgba(238, 169, 109, 0.09)');
  horizonGlow.addColorStop(1, 'rgba(220, 142, 95, 0.20)');
  context.fillStyle = horizonGlow;
  context.fillRect(centerX - radius * 1.2, centerY - radius * 1.2, radius * 2.4, radius * 2.4);
  const starDust = Math.min(90, Math.round(radius / 3));
  for (let index = 0; index < starDust; index += 1) {
    const angle = (index * 137.5) * Math.PI / 180;
    const distance = (0.2 + ((index * 37) % 76) / 100) * radius;
    const x = centerX + Math.sin(angle) * distance;
    const y = centerY - Math.cos(angle) * distance;
    const alpha = 0.03 + ((index * 17) % 30) / 1000;
    context.fillStyle = `rgba(196, 215, 226, ${alpha})`;
    context.fillRect(x, y, 1.1 * dpr, 1.1 * dpr);
  }
  context.restore();
}

function drawGrid(context, centerX, centerY, radius, dpr) {
  context.save();
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  context.clip();
  context.strokeStyle = 'rgba(169, 198, 203, 0.13)';
  context.lineWidth = Math.max(1, dpr * 0.7);
  [30, 60].forEach((altitude) => {
    const gridRadius = radius * (90 - altitude) / 100;
    context.beginPath(); context.arc(centerX, centerY, gridRadius, 0, Math.PI * 2); context.stroke();
  });
  for (let azimuth = 0; azimuth < 360; azimuth += 30) {
    const angle = signedAngle(azimuth - state.viewAzimuth) * Math.PI / 180;
    context.beginPath(); context.moveTo(centerX, centerY); context.lineTo(centerX + radius * Math.sin(angle), centerY - radius * Math.cos(angle)); context.stroke();
  }
  context.restore();
}

function drawConstellations(context, geometry) {
  const { dpr } = geometry;
  state.sky.constellations.forEach((constellation) => {
    if (constellation.visibility < 0.2) return;
    const points = Object.fromEntries(constellation.members.map((star) => [star.id, projectObject(star, geometry)]));
    context.save();
    context.strokeStyle = constellation.color || '#d9b574';
    context.globalAlpha = 0.42;
    context.lineWidth = 1.2 * dpr;
    constellation.segments.forEach(([from, to]) => {
      const start = points[from]; const end = points[to];
      if (!start || !end) return;
      context.beginPath(); context.moveTo(start.x, start.y); context.lineTo(end.x, end.y); context.stroke();
    });
    context.restore();
  });
}

function drawStars(context, geometry) {
  const { dpr } = geometry;
  state.sky.stars.filter((star) => star.altitude > -3).forEach((star) => {
    const point = projectObject(star, geometry);
    const selected = star.id === state.selectedId;
    const size = Math.max(1.4, Math.min(5.4, 4.8 - star.magnitude * 0.7)) * dpr;
    context.save();
    context.shadowColor = star.color;
    context.shadowBlur = selected ? 13 * dpr : size * 1.8;
    context.fillStyle = star.color;
    context.globalAlpha = star.altitude < 0 ? 0.38 : 0.95;
    context.beginPath(); context.arc(point.x, point.y, size, 0, Math.PI * 2); context.fill();
    if (selected) { context.strokeStyle = '#f3d28d'; context.lineWidth = 1 * dpr; context.beginPath(); context.arc(point.x, point.y, size + 5 * dpr, 0, Math.PI * 2); context.stroke(); }
    if (state.layers.labels && (selected || star.magnitude < 0.5)) drawObjectLabel(context, star.name.toUpperCase(), point.x, point.y + size + 13 * dpr, star.color, dpr);
    context.restore();
  });
}

function drawPlanets(context, geometry) {
  const { dpr } = geometry;
  state.sky.objects.filter((object) => ['planet', 'moon', 'sun'].includes(object.type) && object.altitude > -4).forEach((object) => {
    const point = projectObject(object, geometry);
    const selected = object.id === state.selectedId;
    const size = object.type === 'moon' ? 11 : object.type === 'sun' ? 9 : 6.5;
    context.save();
    context.shadowColor = object.color;
    context.shadowBlur = 20 * dpr;
    context.fillStyle = object.color;
    context.globalAlpha = object.altitude < 0 ? 0.35 : 1;
    context.beginPath(); context.arc(point.x, point.y, size * dpr, 0, Math.PI * 2); context.fill();
    context.shadowBlur = 0;
    context.strokeStyle = selected ? '#f3d28d' : 'rgba(245, 228, 184, 0.55)';
    context.lineWidth = (selected ? 1.5 : 0.8) * dpr;
    context.beginPath(); context.arc(point.x, point.y, (size + (selected ? 6 : 3)) * dpr, 0, Math.PI * 2); context.stroke();
    if (state.layers.labels || selected) drawObjectLabel(context, object.name.toUpperCase(), point.x, point.y + (size + 16) * dpr, object.color, dpr);
    context.restore();
  });
}

function drawHorizon(context, centerX, centerY, radius, dpr) {
  context.save();
  context.strokeStyle = 'rgba(224, 190, 127, 0.55)';
  context.lineWidth = 1.25 * dpr;
  context.beginPath(); context.arc(centerX, centerY, radius, 0, Math.PI * 2); context.stroke();
  const labels = [['N', 0], ['E', 90], ['S', 180], ['W', 270]];
  labels.forEach(([label, azimuth]) => {
    const angle = signedAngle(azimuth - state.viewAzimuth) * Math.PI / 180;
    const x = centerX + Math.sin(angle) * (radius + 18 * dpr);
    const y = centerY - Math.cos(angle) * (radius + 18 * dpr);
    context.fillStyle = label === 'S' ? '#eabf77' : 'rgba(204, 218, 216, 0.72)';
    context.font = `600 ${10 * dpr}px Inter, sans-serif`;
    context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(label, x, y);
  });
  context.restore();
}

function drawObjectLabel(context, label, x, y, color, dpr) {
  context.fillStyle = color || '#f4e5be';
  context.font = `600 ${9 * dpr}px Inter, sans-serif`;
  context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(label, x, y);
}

function updateCompassLabel() {
  const label = document.querySelector('#compass-label');
  if (label) label.textContent = formatAzimuth(state.viewAzimuth) === 'N' ? 'NORTH' : formatAzimuth(state.viewAzimuth);
}

function updateConstellationBadge() {
  const badge = document.querySelector('#constellation-badge');
  if (!badge || !state.sky) return;
  const orion = state.sky.constellations.find((constellation) => constellation.id === 'orion');
  badge.style.opacity = orion?.visibility > 0.2 ? '1' : '0.35';
}

function objectAtCanvasPoint(event) {
  const geometry = canvasGeometry();
  const rect = geometry.canvas.getBoundingClientRect();
  const scaleX = geometry.width / rect.width;
  const scaleY = geometry.height / rect.height;
  const point = { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
  const candidates = state.sky.objects.filter((object) => object.altitude > -5).map((object) => ({ object, point: projectObject(object, geometry) })).sort((a, b) => Math.abs(a.object.altitude) - Math.abs(b.object.altitude));
  return candidates.find(({ object, point: target }) => Math.hypot(point.x - target.x, point.y - target.y) < Math.max(16, (object.type === 'star' ? 8 : 13) * geometry.dpr))?.object || null;
}

function updateCanvasHover(event) {
  const hit = objectAtCanvasPoint(event);
  const tooltip = document.querySelector('#sky-tooltip');
  const canvas = document.querySelector('#sky-canvas');
  if (!tooltip || !canvas) return;
  if (!hit) { tooltip.hidden = true; canvas.style.cursor = 'default'; return; }
  tooltip.hidden = false;
  tooltip.innerHTML = `<strong>${hit.name}</strong><span>${hit.type === 'star' ? hit.constellation : `${formatAzimuth(hit.azimuth)} · ${Math.round(hit.altitude)}°`}</span>`;
  const rect = canvas.getBoundingClientRect();
  tooltip.style.left = `${event.clientX - rect.left + 16}px`;
  tooltip.style.top = `${event.clientY - rect.top - 12}px`;
  canvas.style.cursor = 'pointer';
}

function drawShareCard() {
  const canvas = document.querySelector('#share-canvas');
  if (!canvas || !state.sky) return;
  const contextData = state.shareContext || { city: state.city, date: state.date, time: state.time, title: 'YOUR SKY TONIGHT', selected: getSelectedObject() };
  const context = canvas.getContext('2d');
  const width = canvas.width; const height = canvas.height;
  context.fillStyle = '#0b111c'; context.fillRect(0, 0, width, height);
  const gradient = context.createRadialGradient(width * .76, height * .32, 0, width * .76, height * .32, width * .65);
  gradient.addColorStop(0, '#1d3549'); gradient.addColorStop(1, '#0b111c'); context.fillStyle = gradient; context.fillRect(0, 0, width, height);
  context.strokeStyle = 'rgba(230, 194, 128, .28)'; context.lineWidth = 2; context.beginPath(); context.arc(width * .76, height * .48, height * .35, 0, Math.PI * 2); context.stroke();
  for (let index = 0; index < 65; index += 1) { const x = (index * 197) % width; const y = (index * 103) % height; const size = 1 + (index % 3); context.fillStyle = index % 5 === 0 ? '#f0c77f' : '#b8cad8'; context.globalAlpha = .35 + (index % 4) / 8; context.beginPath(); context.arc(x, y, size, 0, Math.PI * 2); context.fill(); }
  const constellation = state.sky.constellations.find((item) => item.id === 'orion');
  const starPoints = Object.fromEntries(constellation.members.map((star, index) => [star.id, { x: width * .62 + ((index * 71) % 220), y: height * .24 + ((index * 53) % 220) }]));
  context.strokeStyle = '#eabf77'; context.globalAlpha = .55; context.lineWidth = 2;
  constellation.segments.forEach(([from, to]) => { const a = starPoints[from]; const b = starPoints[to]; if (!a || !b) return; context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke(); });
  context.globalAlpha = 1;
  context.fillStyle = '#f2e5c4'; context.font = '600 20px Inter, sans-serif'; context.letterSpacing = '4px'; context.fillText('SKYLORE', 72, 72);
  context.fillStyle = '#eabf77'; context.font = '700 56px Inter, sans-serif'; context.fillText(contextData.title, 72, 172);
  context.fillStyle = '#c8d3d4'; context.font = '400 25px Inter, sans-serif'; context.fillText(`${contextData.city.name} · ${formatDate(contextData.date)} · ${formatTime(contextData.time)}`, 76, 218);
  const selected = contextData.selected;
  context.fillStyle = '#f2e5c4'; context.font = '600 29px Inter, sans-serif'; context.fillText(selected?.name ? `Look for ${selected.name}` : 'Look up. Know what you see.', 76, height - 108);
  context.fillStyle = '#aabdc1'; context.font = '400 20px Inter, sans-serif'; context.fillText(selected?.hook || 'A living map of the sky above you.', 76, height - 70);
  context.fillStyle = '#eabf77'; context.font = '700 17px Inter, sans-serif'; context.fillText('SKYLORE  /  skylore', 76, height - 28);
}

function downloadShareCard() {
  const canvas = document.querySelector('#share-canvas');
  if (!canvas) return;
  const context = state.shareContext || { city: state.city, date: state.date };
  const link = document.createElement('a'); link.download = `your-sky-${context.city.id}-${context.date}.png`; link.href = canvas.toDataURL('image/png'); link.click(); showToast('Sky card downloaded');
}

function shareOnX() {
  const context = state.shareContext || { city: state.city, date: state.date, time: state.time, selected: getSelectedObject() };
  const text = `🌌 My sky in ${context.city.name}: ${context.selected?.name || 'a sky full of stories'} · ${formatDate(context.date)} at ${formatTime(context.time)}. Look up. Know what you see.`;
  window.open(`https://x.com/intent/post?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message; toast.classList.add('show');
  window.clearTimeout(showToast.timeout); showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

buildSky();
renderShell();
drawSky();
