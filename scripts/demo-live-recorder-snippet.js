(() => {
  const existing = document.querySelector('[data-demo-live-recorder]');
  if (existing) existing.remove();

  const state = {
    mediaRecorder: null,
    chunks: [],
    stream: null,
    isRecording: false,
  };

  const panel = document.createElement('div');
  panel.dataset.demoLiveRecorder = 'true';
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

  const status = document.createElement('span');
  status.textContent = 'Готов к записи';

  const makeButton = (label, color = '#1677ff') => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.style.cssText = [
      'height:30px',
      'border:0',
      'border-radius:7px',
      'padding:0 10px',
      `background:${color}`,
      'color:white',
      'font:13px Arial,sans-serif',
      'cursor:pointer',
    ].join(';');
    return button;
  };

  const startButton = makeButton('Старт запись');
  const stopButton = makeButton('Стоп + сохранить', '#f5222d');
  stopButton.disabled = true;
  stopButton.style.opacity = '.45';
  panel.append(status, startButton, stopButton);
  document.body.append(panel);

  const showCountdown = async () => {
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

    overlay.remove();
  };

  const installClickRipples = () => {
    const style = document.createElement('style');
    style.dataset.demoLiveRecorderStyle = 'true';
    style.textContent = `
      .demo-live-click-ring {
        position: fixed;
        z-index: 2147483645;
        width: 42px;
        height: 42px;
        margin: -21px 0 0 -21px;
        border: 3px solid #1677ff;
        border-radius: 999px;
        pointer-events: none;
        animation: demo-live-click-ring .52s ease-out forwards;
        box-shadow: 0 0 0 5px rgba(22,119,255,.12);
      }
      @keyframes demo-live-click-ring {
        0% { opacity: 1; transform: scale(.45); }
        100% { opacity: 0; transform: scale(1.45); }
      }
    `;
    document.head.append(style);

    const onPointerDown = (event) => {
      if (!state.isRecording || panel.contains(event.target)) return;
      const ring = document.createElement('span');
      ring.className = 'demo-live-click-ring';
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
      document.body.append(ring);
      window.setTimeout(() => ring.remove(), 700);
    };

    window.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
      style.remove();
    };
  };

  let cleanupRipples = null;

  const saveVideo = () => {
    const blob = new Blob(state.chunks, { type: 'video/webm' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `routes-prototype-demo-${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const stopRecording = () => {
    if (!state.mediaRecorder || !state.isRecording) return;
    state.mediaRecorder.stop();
    state.stream?.getTracks().forEach((track) => track.stop());
    state.isRecording = false;
    cleanupRipples?.();
    cleanupRipples = null;
    panel.style.opacity = '1';
    status.textContent = 'Сохранение...';
    stopButton.disabled = true;
    stopButton.style.opacity = '.45';
  };

  const startRecording = async () => {
    if (state.isRecording) return;
    status.textContent = 'Выбери вкладку/экран...';
    startButton.disabled = true;
    startButton.style.opacity = '.45';

    try {
      state.stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          width: { ideal: 1920 },
          height: { ideal: 1060 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      });

      state.chunks = [];
      state.mediaRecorder = new MediaRecorder(state.stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm',
      });

      state.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) state.chunks.push(event.data);
      });
      state.mediaRecorder.addEventListener('stop', () => {
        saveVideo();
        status.textContent = 'Готово';
        startButton.disabled = false;
        startButton.style.opacity = '1';
      });

      await showCountdown();
      cleanupRipples = installClickRipples();
      state.isRecording = true;
      panel.style.opacity = '.18';
      status.textContent = 'REC';
      stopButton.disabled = false;
      stopButton.style.opacity = '1';
      state.mediaRecorder.start(250);
    } catch (error) {
      status.textContent = 'Запись отменена';
      startButton.disabled = false;
      startButton.style.opacity = '1';
      console.error(error);
    }
  };

  startButton.addEventListener('click', startRecording);
  stopButton.addEventListener('click', stopRecording);
  window.addEventListener('keydown', (event) => {
    if (event.altKey && event.shiftKey && event.code === 'KeyS') {
      stopRecording();
    }
  });

  console.log('Live demo recorder started. Press Alt+Shift+S to stop recording.');
})();
