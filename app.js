(() => {
  const dayDateEl = document.getElementById('day-date');
  const timeEl = document.getElementById('time');
  const gridEl = document.getElementById('dot-grid');
  const footerEl = document.getElementById('footer');

  let dots = [];
  let lastTotalDays = null;

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const getStats = () => {
    const now = new Date();
    const year = now.getFullYear();
    const totalDays = isLeapYear(year) ? 366 : 365;
    const start = new Date(year, 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const remaining = totalDays - dayOfYear;
    const percent = Math.round((dayOfYear / totalDays) * 100);
    return { now, year, totalDays, dayOfYear, remaining, percent };
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  const buildDots = (total) => {
    gridEl.innerHTML = '';
    dots = [];
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      fragment.appendChild(dot);
      dots.push(dot);
    }
    gridEl.appendChild(fragment);
  };

  const render = () => {
    const stats = getStats();

    if (stats.totalDays !== lastTotalDays) {
      buildDots(stats.totalDays);
      lastTotalDays = stats.totalDays;
    }

    dayDateEl.textContent = formatDate(stats.now);
    timeEl.textContent = formatTime(stats.now);

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx < stats.dayOfYear);
    });

    footerEl.textContent = `${stats.remaining} days left · ${stats.percent}% complete`;
  };

  render();
  setInterval(render, 60 * 1000);
})();
