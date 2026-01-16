(() => {
  const dayDateEl = document.getElementById('day-date');
  const timeEl = document.getElementById('time');
  const gridEl = document.getElementById('dot-grid');
  const footerEl = document.getElementById('footer');

  let dots = [];
  let lastTotalDays = null;
  let lastDay = null;
  let lastMinute = null;

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const getStats = (now = new Date()) => {
    const year = now.getFullYear();
    const totalDays = isLeapYear(year) ? 366 : 365;
    const start = new Date(year, 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const remaining = totalDays - dayOfYear;
    const percent = Math.round((dayOfYear / totalDays) * 100);
    return { now, totalDays, dayOfYear, remaining, percent };
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const updateDate = (date) => {
    dayDateEl.textContent = formatDate(date);
  };

  const formatTime = (date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  const updateTime = (now) => {
    const minutes = now.getMinutes();
    if (minutes === lastMinute && timeEl.textContent) return;
    lastMinute = minutes;

    const timeString = formatTime(now);
    if (timeEl.textContent !== timeString) {
      timeEl.textContent = timeString;
      timeEl.classList.remove('tick');
      void timeEl.offsetWidth;
      timeEl.classList.add('tick');
    }
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

  const applyDots = (dayOfYear) => {
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx < dayOfYear);
    });
  };

  const animateTodayDot = (dayOfYear) => {
    const idx = dayOfYear - 1;
    if (idx < 0 || idx >= dots.length) return;
    const dot = dots[idx];
    dot.classList.remove('pop');
    void dot.offsetWidth;
    dot.classList.add('pop');
  };

  const renderProgress = (now = new Date(), skipAnimation = false) => {
    const stats = getStats(now);

    if (stats.totalDays !== lastTotalDays) {
      buildDots(stats.totalDays);
      lastTotalDays = stats.totalDays;
    }

    updateDate(now);
    applyDots(stats.dayOfYear);
    footerEl.textContent = `${stats.remaining} days left · ${stats.percent}% complete`;

    if (!skipAnimation) {
      animateTodayDot(stats.dayOfYear);
    }
  };

  const init = () => {
    const now = new Date();
    lastDay = now.getDate();
    lastMinute = now.getMinutes();

    renderProgress(now, true);
    updateTime(now);

    setInterval(() => {
      const current = new Date();
      updateTime(current);

      if (current.getDate() !== lastDay) {
        lastDay = current.getDate();
        renderProgress(current);
      }
    }, 1000);
  };

  init();
})();
