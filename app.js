(() => {
    const activityEl = document.getElementById('github-activity');
    const timeEl = document.getElementById('github-time');
    const jsroweValue = document.getElementById('jsrowe-feed');
    const jsroweTime = document.getElementById('jsrowe-time');
    const notedValue = document.getElementById('noted-feed');
    const notedTime = document.getElementById('noted-time');
    const lastUpdatedEl = document.getElementById('last-updated');
    const healthFill = document.getElementById('health-fill');
    const healthMeta = document.getElementById('health-meta');
    const healthCountdown = document.getElementById('health-countdown');
    const aliveSecondsEl = document.getElementById('alive-seconds');

    if (!activityEl || !timeEl || !jsroweValue || !jsroweTime || !notedValue || !notedTime) {
        return;
    }

    const birthYear = 1985;
    const targetAge = 70;
    const now = new Date();
    const currentYear = now.getFullYear();
    const age = Math.max(0, currentYear - birthYear);
    const progress = Math.min(1, age / targetAge);
    const targetYear = birthYear + targetAge;
    const yearsRemaining = Math.max(0, targetAge - age);
    const birthTimestamp = Date.UTC(1985, 0, 1, 0, 0, 0);
    const targetDate = new Date(targetYear, 0, 1);
    const daysLeft = Math.max(0, Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24)));
    const monthsLeft = Math.max(
        0,
        (targetYear * 12) - (currentYear * 12 + now.getMonth()) - (now.getDate() > 1 ? 1 : 0)
    );
    const newYearsLeft = Math.max(0, targetYear - currentYear);
    const weekendsLeft = Math.max(0, Math.floor(daysLeft / 7));

    if (healthFill) {
        healthFill.style.width = `${Math.round(progress * 100)}%`;
    }
    if (healthMeta) {
        const percent = Math.round(progress * 100);
        healthMeta.textContent = `${percent}% of avg. life lived · Estimated years remaining: ${yearsRemaining}`;
    }
    if (healthCountdown) {
        healthCountdown.innerHTML = `Remaining: ${monthsLeft} months &bull; ${weekendsLeft} weekends &bull; ${daysLeft} days`;
    }
    if (aliveSecondsEl) {
        const updateAliveSeconds = () => {
            const secondsAlive = Math.max(0, Math.floor((Date.now() - birthTimestamp) / 1000));
            aliveSecondsEl.textContent = `${secondsAlive.toLocaleString()} seconds and counting`;
        };
        updateAliveSeconds();
        setInterval(updateAliveSeconds, 1000);
    }

    fetch('./data/feeds.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Feed data unavailable');
            }
            return response.json();
        })
        .then((data) => {
            if (lastUpdatedEl && data.generatedAt) {
                lastUpdatedEl.textContent = new Date(data.generatedAt).toLocaleString();
            }
            if (data.github && data.github.text && data.github.link) {
                activityEl.innerHTML = `${data.github.text} <a href="${data.github.link}">${data.github.link.replace('https://github.com/', '')}</a>`;
                timeEl.textContent = data.github.date ? `Last signal: ${new Date(data.github.date).toLocaleString()}` : '';
            } else {
                activityEl.textContent = 'Quiet right now.';
                timeEl.textContent = '';
            }

            if (data.feeds && data.feeds.jsrowe && data.feeds.jsrowe.title) {
                const jsrowe = data.feeds.jsrowe;
                jsroweValue.innerHTML = jsrowe.link ? `<a href="${jsrowe.link}">${jsrowe.title}</a>` : jsrowe.title;
                jsroweTime.textContent = jsrowe.date ? `Last post: ${new Date(jsrowe.date).toLocaleDateString()}` : '';
            } else {
                jsroweValue.textContent = 'Feed unavailable.';
                jsroweTime.textContent = '';
            }

            if (data.feeds && data.feeds.noted && data.feeds.noted.title) {
                const noted = data.feeds.noted;
                notedValue.innerHTML = noted.link ? `<a href="${noted.link}">${noted.title}</a>` : noted.title;
                notedTime.textContent = noted.date ? `Last post: ${new Date(noted.date).toLocaleDateString()}` : '';
            } else {
                notedValue.textContent = 'Feed unavailable.';
                notedTime.textContent = '';
            }
        })
        .catch(() => {
            activityEl.textContent = 'Feed unavailable.';
            timeEl.textContent = '';
            jsroweValue.textContent = 'Feed unavailable.';
            jsroweTime.textContent = '';
            notedValue.textContent = 'Feed unavailable.';
            notedTime.textContent = '';
            if (lastUpdatedEl) {
                lastUpdatedEl.textContent = 'unknown';
            }
        });
})();
