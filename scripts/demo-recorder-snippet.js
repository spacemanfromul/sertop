(() => {
  const existing = document.querySelector('[data-demo-recorder]');
  if (existing) existing.remove();

  const state = {
    events: [],
    lastAt: performance.now(),
    pointerStart: null,
    pointerPath: [],
    isRecording: false,
    isCountingDown: false,
    inputTimers: new Map(),
    stopped: false,
  };

  const panel = document.createElement('div');
  panel.dataset.demoRecorder = 'true';
  panel.style.cssText = [
    'position:fixed',
    'right:20px',
    'bottom:20px',
    'z-index:2147483647',
    'display:flex',
    'align-items:center',
    'gap:8px',
    'padding:8px',
    'border-radius:10px',
    'background:rgba(17,24,39,.9)',
    'color:#fff',
    'font:13px/1.3 Arial,sans-serif',
    'box-shadow:0 10px 30px rgba(0,0,0,.25)',
  ].join(';');

  const count = document.createElement('span');
  count.textContent = 'Готов к записи';

  const makeButton = (label) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.style.cssText = [
      'height:30px',
      'border:0',
      'border-radius:7px',
      'padding:0 10px',
      'background:#1677ff',
      'color:white',
      'font:13px Arial,sans-serif',
      'cursor:pointer',
    ].join(';');
    return button;
  };

  const startButton = makeButton('Старт');
  const saveButton = makeButton('Сохранить JSON');
  const clearButton = makeButton('Очистить');
  const stopButton = makeButton('Стоп');
  panel.append(count, startButton, saveButton, clearButton, stopButton);
  document.body.append(panel);

  const updateCount = () => {
    count.textContent = state.isRecording ? `${state.events.length} действий` : `Пауза · ${state.events.length}`;
  };

  const isRecorderTarget = (target) => panel.contains(target);

  const getDelay = (at = performance.now()) => {
    const delay = Math.max(0, Math.round(at - state.lastAt));
    return delay;
  };

  const commitTime = (at = performance.now()) => {
    state.lastAt = at;
  };

  const getPoint = (event) => ({
    x: Math.round(event.clientX),
    y: Math.round(event.clientY),
  });

  const getTargetInfo = (target) => ({
    selector: cssPath(target),
    text: target?.innerText?.trim?.().slice(0, 80) || target?.textContent?.trim?.().slice(0, 80) || '',
    ariaLabel: target?.getAttribute?.('aria-label') || '',
  });

  const getElementCenter = (target) => {
    if (!(target instanceof Element)) return null;
    const rect = target.getBoundingClientRect();
    return {
      x: Math.round(rect.left + rect.width / 2),
      y: Math.round(rect.top + rect.height / 2),
    };
  };

  const getLegacyDelay = () => {
    const now = performance.now();
    const delay = Math.max(0, Math.round(now - state.lastAt));
    state.lastAt = now;
    return delay;
  };

  const cssPath = (element) => {
    if (!(element instanceof Element)) return null;
    if (element.id) return `#${CSS.escape(element.id)}`;
    const parts = [];
    let current = element;
    while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
      const tag = current.tagName.toLowerCase();
      const parent = current.parentElement;
      if (!parent) break;
      const sameTag = [...parent.children].filter((child) => child.tagName === current.tagName);
      const index = sameTag.indexOf(current) + 1;
      parts.unshift(`${tag}:nth-of-type(${index})`);
      current = parent;
    }
    return parts.length ? parts.join(' > ') : null;
  };

  const pushEvent = (event) => {
    if (state.stopped || !state.isRecording) return;
    state.events.push({
      delay: event.delay ?? getLegacyDelay(),
      ...event,
    });
    updateCount();
  };

  const onPointerDown = (event) => {
    if (isRecorderTarget(event.target)) return;
    if (!state.isRecording) return;
    const at = performance.now();
    state.pointerStart = {
      x: Math.round(event.clientX),
      y: Math.round(event.clientY),
      at,
      button: event.button,
      delay: getDelay(at),
      target: getTargetInfo(event.target),
    };
    state.pointerPath = [getPoint(event)];
  };

  const onPointerMove = (event) => {
    if (!state.isRecording) return;
    if (!state.pointerStart) return;
    const lastPoint = state.pointerPath[state.pointerPath.length - 1];
    const nextPoint = getPoint(event);
    if (!lastPoint || Math.hypot(nextPoint.x - lastPoint.x, nextPoint.y - lastPoint.y) >= 4) {
      state.pointerPath.push(nextPoint);
    }
  };

  const onPointerUp = (event) => {
    if (isRecorderTarget(event.target) || !state.pointerStart) return;
    if (!state.isRecording) return;
    const start = state.pointerStart;
    const path = [...state.pointerPath, getPoint(event)];
    state.pointerStart = null;
    state.pointerPath = [];
    if (start.button !== 0) return;

    const end = {
      x: Math.round(event.clientX),
      y: Math.round(event.clientY),
    };
    const distance = Math.hypot(end.x - start.x, end.y - start.y);

    if (distance > 8) {
      pushEvent({
        type: 'drag',
        delay: start.delay,
        from: { x: start.x, y: start.y },
        to: end,
        path,
        duration: Math.max(120, Math.round(performance.now() - start.at)),
        target: start.target,
      });
      commitTime();
      return;
    }

    pushEvent({
      type: 'click',
      delay: start.delay,
      x: end.x,
      y: end.y,
      target: start.target,
    });
    commitTime();
  };

  const onInput = (event) => {
    if (isRecorderTarget(event.target)) return;
    if (!state.isRecording) return;
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
    const selector = cssPath(target);
    if (!selector) return;

    window.clearTimeout(state.inputTimers.get(selector));
    const at = performance.now();
    state.inputTimers.set(selector, window.setTimeout(() => {
      pushEvent({
        type: 'input',
        delay: getDelay(at),
        selector,
        point: getElementCenter(target),
        target: getTargetInfo(target),
        value: target.value,
      });
      commitTime();
      state.inputTimers.delete(selector);
    }, 250));
  };

  const save = async () => {
    if (state.inputTimers.size) {
      await new Promise((resolve) => setTimeout(resolve, 320));
    }

    const payload = {
      version: 2,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      createdAt: new Date().toISOString(),
      events: state.events,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `demo-scenario-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const cleanup = () => {
    state.stopped = true;
    state.inputTimers.forEach((timer) => window.clearTimeout(timer));
    state.inputTimers.clear();
    window.removeEventListener('pointerdown', onPointerDown, true);
    window.removeEventListener('pointermove', onPointerMove, true);
    window.removeEventListener('pointerup', onPointerUp, true);
    window.removeEventListener('input', onInput, true);
    panel.remove();
  };

  const showCountdown = async () => {
    if (state.isCountingDown || state.isRecording) return;
    state.isCountingDown = true;
    startButton.disabled = true;
    startButton.textContent = '...';
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:2147483646',
      'display:grid',
      'place-items:center',
      'pointer-events:none',
      'background:rgba(0,0,0,.08)',
      'color:white',
      'font:700 120px/1 Arial,sans-serif',
      'text-shadow:0 8px 30px rgba(0,0,0,.45)',
    ].join(';');
    document.body.append(overlay);

    for (const value of ['3', '2', '1']) {
      overlay.textContent = value;
      overlay.animate(
        [
          { transform: 'scale(.75)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1, offset: 0.2 },
          { transform: 'scale(1.08)', opacity: 1, offset: 0.75 },
          { transform: 'scale(1.18)', opacity: 0 },
        ],
        { duration: 900, easing: 'ease-out' },
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    overlay.textContent = 'REC';
    overlay.style.fontSize = '72px';
    overlay.style.color = '#ff4d4f';
    overlay.animate(
      [
        { transform: 'scale(.9)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1, offset: 0.25 },
        { transform: 'scale(1.05)', opacity: 0 },
      ],
      { duration: 650, easing: 'ease-out' },
    );
    await new Promise((resolve) => setTimeout(resolve, 650));
    overlay.remove();

    state.isRecording = true;
    state.isCountingDown = false;
    state.lastAt = performance.now();
    startButton.textContent = 'Запись';
    startButton.style.background = '#f5222d';
    updateCount();
  };

  startButton.addEventListener('click', showCountdown);
  saveButton.addEventListener('click', save);
  clearButton.addEventListener('click', () => {
    state.events = [];
    state.lastAt = performance.now();
    updateCount();
  });
  stopButton.addEventListener('click', cleanup);

  window.addEventListener('pointerdown', onPointerDown, true);
  window.addEventListener('pointermove', onPointerMove, true);
  window.addEventListener('pointerup', onPointerUp, true);
  window.addEventListener('input', onInput, true);

  console.log('Demo recorder started. Click "Сохранить JSON" when done.');
})();
