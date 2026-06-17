(() => {
  const existingStyle = document.querySelector('[data-demo-click-ripple-style]');
  existingStyle?.remove();
  window.__demoClickRippleCleanup?.();

  let enabled = true;
  let activeRipple = null;
  let lastPoint = null;
  let rafId = null;
  let trackedElement = null;

  const style = document.createElement('style');
  style.dataset.demoClickRippleStyle = 'true';
  style.textContent = `
    .demo-click-ripple {
      position: fixed;
      z-index: 2147483647;
      width: 56px;
      height: 56px;
      margin: -28px 0 0 -28px;
      border: 4px solid #1677ff;
      border-radius: 999px;
      pointer-events: none;
      opacity: 1;
      transform: scale(.72);
      box-shadow: 0 0 0 8px rgba(22,119,255,.16);
      animation: demo-click-ripple-hold .9s ease-in-out infinite alternate;
    }
    .demo-click-ripple.is-released {
      animation: demo-click-ripple-release .42s ease-out forwards;
    }
    @keyframes demo-click-ripple-hold {
      0% { transform: scale(.72); box-shadow: 0 0 0 6px rgba(22,119,255,.14); }
      100% { transform: scale(1.04); box-shadow: 0 0 0 14px rgba(22,119,255,.2); }
    }
    @keyframes demo-click-ripple-release {
      0% { opacity: .95; transform: scale(1); }
      100% { opacity: 0; transform: scale(1.65); }
    }
  `;
  document.head.append(style);

  const setRipplePosition = (point) => {
    if (!activeRipple || !point) return;
    activeRipple.style.left = `${point.x}px`;
    activeRipple.style.top = `${point.y}px`;
  };

  const getElementPoint = (element) => {
    const rect = element?.getBoundingClientRect?.();
    if (!rect) return null;
    return {
      x: Math.round(rect.left + rect.width / 2),
      y: Math.round(rect.top + rect.height / 2),
    };
  };

  const startFollowLoop = () => {
    if (rafId) return;
    const tick = () => {
      if (trackedElement) {
        lastPoint = getElementPoint(trackedElement) || lastPoint;
      }
      setRipplePosition(lastPoint);
      rafId = activeRipple ? window.requestAnimationFrame(tick) : null;
    };
    rafId = window.requestAnimationFrame(tick);
  };

  const getEventPoint = (event) => {
    const touch = event.touches?.[0] || event.changedTouches?.[0];
    return {
      x: Math.round(touch?.clientX ?? event.clientX ?? 0),
      y: Math.round(touch?.clientY ?? event.clientY ?? 0),
    };
  };

  const onPointerDown = (event) => {
    if (!enabled) return;
    activeRipple?.remove();
    trackedElement = event.target?.closest?.('.route-geozone-midpoint, .route-geozone-draft-point, .leaflet-marker-icon') || null;
    lastPoint = getEventPoint(event);
    if (trackedElement) {
      lastPoint = getElementPoint(trackedElement) || lastPoint;
    }
    const ripple = document.createElement('span');
    ripple.className = 'demo-click-ripple';
    ripple.style.left = `${lastPoint.x}px`;
    ripple.style.top = `${lastPoint.y}px`;
    document.body.append(ripple);
    activeRipple = ripple;
    startFollowLoop();
  };

  const onPointerMove = (event) => {
    if (!activeRipple) return;
    lastPoint = getEventPoint(event);
    setRipplePosition(lastPoint);
  };

  const onPointerUp = () => {
    if (!activeRipple) return;
    const ripple = activeRipple;
    activeRipple = null;
    trackedElement = null;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    ripple.classList.add('is-released');
    window.setTimeout(() => ripple.remove(), 520);
  };

  const cleanup = () => {
    removeListeners(window);
    removeListeners(document);
    if (rafId) window.cancelAnimationFrame(rafId);
    trackedElement = null;
    activeRipple?.remove();
    style.remove();
    delete window.__demoClickRippleCleanup;
  };

  const addListeners = (target) => {
    target.addEventListener('pointerdown', onPointerDown, true);
    target.addEventListener('mousedown', onPointerDown, true);
    target.addEventListener('touchstart', onPointerDown, true);
    target.addEventListener('pointermove', onPointerMove, true);
    target.addEventListener('mousemove', onPointerMove, true);
    target.addEventListener('touchmove', onPointerMove, true);
    target.addEventListener('drag', onPointerMove, true);
    target.addEventListener('pointerup', onPointerUp, true);
    target.addEventListener('mouseup', onPointerUp, true);
    target.addEventListener('touchend', onPointerUp, true);
    target.addEventListener('pointercancel', onPointerUp, true);
    target.addEventListener('touchcancel', onPointerUp, true);
    target.addEventListener('blur', onPointerUp, true);
  };

  const removeListeners = (target) => {
    target.removeEventListener('pointerdown', onPointerDown, true);
    target.removeEventListener('mousedown', onPointerDown, true);
    target.removeEventListener('touchstart', onPointerDown, true);
    target.removeEventListener('pointermove', onPointerMove, true);
    target.removeEventListener('mousemove', onPointerMove, true);
    target.removeEventListener('touchmove', onPointerMove, true);
    target.removeEventListener('drag', onPointerMove, true);
    target.removeEventListener('pointerup', onPointerUp, true);
    target.removeEventListener('mouseup', onPointerUp, true);
    target.removeEventListener('touchend', onPointerUp, true);
    target.removeEventListener('pointercancel', onPointerUp, true);
    target.removeEventListener('touchcancel', onPointerUp, true);
    target.removeEventListener('blur', onPointerUp, true);
  };

  addListeners(window);
  addListeners(document);
  window.__demoClickRippleCleanup = cleanup;
  window.__demoClickRippleToggle = () => {
    enabled = !enabled;
    return enabled;
  };

  console.log('Click ripple enabled. Run window.__demoClickRippleCleanup() to remove it.');
})();
