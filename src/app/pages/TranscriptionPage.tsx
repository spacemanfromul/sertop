import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Clock3, Copy, Download, FileAudio, History, LoaderCircle, RotateCcw, Trash2, UploadCloud, X } from 'lucide-react';
import { deleteTranscriptionHistoryItem, getTranscriptionHistory, MAX_TRANSCRIPTION_FILE_SIZE, transcribeFile, type TranscriptionHistoryItem, type TranscriptionResult } from '../../services/transcriptionApi';

const ACCEPT = '.mp3,.ogg,.wav,.m4a,.mp4,.mov';
const extensions = new Set(['mp3', 'ogg', 'wav', 'm4a', 'mp4', 'mov']);
const languages = [{ value: 'ru', label: 'Русский' }, { value: 'en', label: 'English' }, { value: 'de', label: 'Deutsch' }, { value: 'fr', label: 'Français' }, { value: 'es', label: 'Español' }];

function formatBytes(value: number) {
  return value < 1024 * 1024 ? `${Math.ceil(value / 1024)} КБ` : `${(value / 1024 / 1024).toFixed(1)} МБ`;
}

function formatTime(value: number) {
  const seconds = Math.max(0, Math.floor(value));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}` : `${minutes}:${String(rest).padStart(2, '0')}`;
}

export default function TranscriptionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('ru');
  const [timestamps, setTimestamps] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<TranscriptionHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');
  const [openHistoryId, setOpenHistoryId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = 'Расшифровка аудио и видео — Сергей Топорков';
    void loadHistory();
    return () => abortRef.current?.abort();
  }, []);

  const loadHistory = async () => {
    try {
      setHistory(await getTranscriptionHistory());
      setHistoryError('');
    } catch (loadError) {
      setHistoryError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить историю.');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (status !== 'processing') return;
    const startedAt = Date.now();
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  const chooseFile = (selected?: File) => {
    if (!selected) return;
    const extension = selected.name.split('.').pop()?.toLowerCase() ?? '';
    if (!extensions.has(extension)) {
      setError('Поддерживаются MP3, OGG, WAV, M4A, MP4 и MOV.');
      setStatus('error');
      return;
    }
    if (selected.size > MAX_TRANSCRIPTION_FILE_SIZE) {
      setError('Файл больше 100 МБ. Выберите файл меньшего размера.');
      setStatus('error');
      return;
    }
    setFile(selected);
    setResult(null);
    setError('');
    setStatus('idle');
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    chooseFile(event.dataTransfer.files[0]);
  };

  const start = async () => {
    if (!file) {
      setError('Сначала выберите аудио- или видеофайл.');
      setStatus('error');
      return;
    }
    setStatus('processing');
    setError('');
    setElapsed(0);
    abortRef.current = new AbortController();
    try {
      const response = await transcribeFile({ file, language, timestamps, signal: abortRef.current.signal });
      setResult(response);
      setStatus('success');
      void loadHistory();
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') {
        setStatus('idle');
      } else {
        setError(requestError instanceof Error ? requestError.message : 'Произошла неизвестная ошибка.');
        setStatus('error');
      }
    } finally {
      abortRef.current = null;
    }
  };

  const copyText = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const downloadText = () => {
    if (!result) return;
    const blob = new Blob([result.text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file?.name.replace(/\.[^.]+$/, '') || 'transcription'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null); setResult(null); setError(''); setStatus('idle'); setElapsed(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeHistoryItem = async (item: TranscriptionHistoryItem) => {
    if (!window.confirm(`Удалить расшифровку «${item.fileName}»?`)) return;
    try {
      await deleteTranscriptionHistoryItem(item.id);
      setHistory((current) => current.filter((entry) => entry.id !== item.id));
      if (openHistoryId === item.id) setOpenHistoryId(null);
    } catch (removeError) {
      setHistoryError(removeError instanceof Error ? removeError.message : 'Не удалось удалить расшифровку.');
    }
  };

  const downloadHistoryItem = (item: TranscriptionHistoryItem) => {
    const blob = new Blob([item.text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.fileName.replace(/\.[^.]+$/, '') || 'transcription'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#191c1d]">
      <div className="mx-auto max-w-[1180px] px-4 py-8 md:px-8 md:py-14">
        <header className="mb-10 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 font-medium"><span className="flex size-11 items-center justify-center rounded-full bg-[#e9f1ff]">Т</span><span>toporkovdsgnr</span></a>
          <span className="rounded-full bg-[#e9f1ff] px-4 py-2 text-sm font-medium text-[#0842a0]">AI-инструмент</span>
        </header>

        <section className="mb-10 max-w-3xl">
          <h1 className="text-[42px] font-medium leading-[1.06] tracking-[-1.5px] md:text-[64px]">Расшифровка аудио и видео</h1>
          <p className="mt-5 max-w-2xl text-lg leading-7 text-[#5f6368] md:text-xl">Загрузите запись — сервис превратит речь в текст и при необходимости разложит её по таймкодам.</p>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
          <section className="rounded-[28px] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,.08)] md:p-8">
            {!result ? (
              <>
                <div onDragEnter={() => setDragging(true)} onDragLeave={() => setDragging(false)} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} className={`relative flex min-h-[260px] flex-col items-center justify-center rounded-[22px] border-2 border-dashed px-6 text-center transition ${dragging ? 'border-[#0b57d0] bg-[#e9f1ff]' : file ? 'border-[#a8c7fa] bg-[#f7faff]' : 'border-[#c7c9cc] bg-[#fafbfc]'}`}>
                  <input ref={inputRef} type="file" accept={ACCEPT} className="hidden" onChange={(e: ChangeEvent<HTMLInputElement>) => chooseFile(e.target.files?.[0])} />
                  {file ? <FileAudio className="mb-4 size-11 text-[#0b57d0]" /> : <UploadCloud className="mb-4 size-11 text-[#5f6368]" />}
                  <h2 className="text-xl font-medium">{file ? file.name : 'Перетащите файл сюда'}</h2>
                  <p className="mt-2 text-sm text-[#5f6368]">{file ? `${formatBytes(file.size)} · готов к распознаванию` : 'MP3, OGG, WAV, M4A, MP4 или MOV · до 100 МБ'}</p>
                  <button type="button" disabled={status === 'processing'} onClick={() => inputRef.current?.click()} className="mt-6 rounded-full border border-[#74777b] bg-white px-5 py-3 font-medium transition hover:bg-[#f1f3f4] disabled:opacity-50">{file ? 'Выбрать другой' : 'Выбрать файл'}</button>
                </div>

                {status === 'processing' && <div className="mt-6 rounded-[20px] bg-[#e9f1ff] p-5"><div className="flex items-center gap-4"><LoaderCircle className="size-7 shrink-0 animate-spin text-[#0b57d0]" /><div className="min-w-0 flex-1"><p className="font-medium">Распознаём запись</p><p className="mt-1 text-sm text-[#5f6368]">Прошло {formatTime(elapsed)}. Длинные записи могут обрабатываться 4–8 минут.</p></div><button onClick={() => abortRef.current?.abort()} className="rounded-full p-2 hover:bg-black/5" aria-label="Отменить"><X /></button></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#c2d7f8]"><div className="h-full w-1/3 animate-[transcription-progress_1.5s_ease-in-out_infinite] rounded-full bg-[#0b57d0]" /></div></div>}
                {status === 'error' && error && <div role="alert" className="mt-5 rounded-[18px] bg-[#ffdad6] p-4 text-[#410002]">{error}</div>}

                <button type="button" onClick={start} disabled={status === 'processing'} className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0b57d0] px-6 font-medium text-white transition hover:bg-[#0842a0] disabled:cursor-not-allowed disabled:opacity-60">{status === 'processing' ? <><LoaderCircle className="size-5 animate-spin" />Обрабатываем…</> : 'Начать расшифровку'}</button>
              </>
            ) : (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-[#137333]"><Check className="size-5" /><span className="text-sm font-medium">Готово</span></div><h2 className="text-2xl font-medium">Текст расшифровки</h2><p className="mt-2 text-sm text-[#5f6368]">{formatTime(result.duration)} · язык: {result.language.toUpperCase()}</p></div><div className="flex gap-2"><button onClick={copyText} className="flex items-center gap-2 rounded-full border border-[#74777b] px-4 py-2.5 text-sm font-medium hover:bg-[#f1f3f4]">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}{copied ? 'Скопировано' : 'Копировать'}</button><button onClick={downloadText} className="rounded-full border border-[#74777b] p-2.5 hover:bg-[#f1f3f4]" aria-label="Скачать TXT"><Download className="size-5" /></button></div></div>
                <div className="mt-7 whitespace-pre-wrap rounded-[20px] bg-[#f7f8fa] p-5 text-base leading-7">{result.text}</div>
                {!!result.segments?.length && <div className="mt-8"><h3 className="mb-4 text-lg font-medium">Таймкоды</h3><div className="divide-y divide-[#e2e4e7]">{result.segments.map((segment, index) => <div key={`${segment.start}-${index}`} className="grid grid-cols-[92px_1fr] gap-4 py-4"><span className="font-mono text-sm text-[#0b57d0]">{formatTime(segment.start)}–{formatTime(segment.end)}</span><p className="leading-6">{segment.text}</p></div>)}</div></div>}
                <button onClick={reset} className="mt-8 flex items-center gap-2 rounded-full bg-[#e9f1ff] px-5 py-3 font-medium text-[#0842a0] hover:bg-[#d7e7ff]"><RotateCcw className="size-4" />Расшифровать другой файл</button>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <section className="rounded-[24px] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,.08)]"><h2 className="mb-4 font-medium">Настройки</h2><label className="block text-sm text-[#5f6368]">Язык<select value={language} onChange={(e) => setLanguage(e.target.value)} disabled={status === 'processing'} className="mt-2 h-12 w-full rounded-[14px] border border-[#c7c9cc] bg-white px-4 text-[#191c1d] outline-none focus:border-2 focus:border-[#0b57d0]">{languages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="mt-5 flex cursor-pointer items-center justify-between gap-4"><span><span className="block text-sm font-medium">Таймкоды</span><span className="mt-1 block text-xs text-[#5f6368]">Разделить текст на фрагменты</span></span><input type="checkbox" checked={timestamps} onChange={(e) => setTimestamps(e.target.checked)} disabled={status === 'processing'} className="size-5 accent-[#0b57d0]" /></label></section>
            <div className="flex gap-3 rounded-[20px] bg-[#eef0f2] p-4 text-sm leading-5 text-[#5f6368]"><Clock3 className="mt-0.5 size-5 shrink-0" /><p>Не закрывайте вкладку во время обработки. Для записи на 30 минут обычно требуется 4–8 минут.</p></div>
          </aside>
        </div>

        <section className="mt-8 rounded-[28px] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,.08)] md:p-8">
          <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-[#e9f1ff] text-[#0b57d0]"><History className="size-5" /></span><div><h2 className="text-2xl font-medium">История расшифровок</h2><p className="mt-1 text-sm text-[#5f6368]">Последние {history.length} из 100 записей · исходные файлы не сохраняются</p></div></div>
          {historyLoading && <div className="mt-6 flex items-center gap-3 text-sm text-[#5f6368]"><LoaderCircle className="size-5 animate-spin" />Загружаем историю…</div>}
          {historyError && <div role="alert" className="mt-5 rounded-[18px] bg-[#ffdad6] p-4 text-[#410002]">{historyError}</div>}
          {!historyLoading && !history.length && !historyError && <div className="mt-6 rounded-[20px] bg-[#f7f8fa] px-5 py-10 text-center text-[#5f6368]">Здесь появятся готовые расшифровки.</div>}
          {!!history.length && <div className="mt-6 divide-y divide-[#e2e4e7]">{history.map((item) => {
            const isOpen = openHistoryId === item.id;
            return <article key={item.id} className="py-2"><div className="flex items-center gap-3 py-3"><button type="button" onClick={() => setOpenHistoryId(isOpen ? null : item.id)} className="flex min-w-0 flex-1 items-center gap-4 text-left"><FileAudio className="size-6 shrink-0 text-[#0b57d0]" /><span className="min-w-0 flex-1"><span className="block truncate font-medium">{item.fileName}</span><span className="mt-1 block text-xs text-[#5f6368]">{new Date(item.createdAt).toLocaleString('ru-RU')} · {formatTime(item.duration)} · {item.language.toUpperCase()} · {formatBytes(item.fileSize)}</span></span><ChevronDown className={`size-5 shrink-0 text-[#5f6368] transition ${isOpen ? 'rotate-180' : ''}`} /></button><button onClick={() => downloadHistoryItem(item)} className="rounded-full p-2.5 hover:bg-[#f1f3f4]" aria-label="Скачать TXT"><Download className="size-5" /></button><button onClick={() => void removeHistoryItem(item)} className="rounded-full p-2.5 text-[#b3261e] hover:bg-[#ffdad6]" aria-label="Удалить"><Trash2 className="size-5" /></button></div>{isOpen && <div className="mb-4 ml-0 rounded-[18px] bg-[#f7f8fa] p-5 md:ml-10"><p className="whitespace-pre-wrap leading-7">{item.text}</p>{!!item.segments?.length && <div className="mt-6 border-t border-[#dfe1e5] pt-4">{item.segments.map((segment, index) => <div key={`${segment.start}-${index}`} className="grid grid-cols-[80px_1fr] gap-3 py-2 text-sm"><span className="font-mono text-[#0b57d0]">{formatTime(segment.start)}</span><span>{segment.text}</span></div>)}</div>}</div>}</article>;
          })}</div>}
        </section>
      </div>
    </main>
  );
}
