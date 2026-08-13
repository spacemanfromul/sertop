export const TRANSCRIPTION_API_URL = '/api/transcribe';
export const MAX_TRANSCRIPTION_FILE_SIZE = 100 * 1024 * 1024;

export type TranscriptionSegment = {
  start: number;
  end: number;
  text: string;
};

export type TranscriptionResult = {
  language: string;
  duration: number;
  text: string;
  segments?: TranscriptionSegment[];
};

export type TranscriptionHistoryItem = TranscriptionResult & {
  id: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
};

export async function transcribeFile(options: {
  file: File;
  language: string;
  timestamps: boolean;
  signal?: AbortSignal;
}): Promise<TranscriptionResult> {
  const body = new FormData();
  body.append('file', options.file);
  body.append('language', options.language);
  body.append('timestamps', String(options.timestamps));

  const response = await fetch(TRANSCRIPTION_API_URL, {
    method: 'POST',
    headers: {
      'X-Transcription-File-Name': encodeURIComponent(options.file.name),
      'X-Transcription-File-Size': String(options.file.size),
    },
    body,
    signal: options.signal,
  });

  if (!response.ok) {
    let detail = '';
    try {
      const payload = await response.json() as { detail?: string };
      detail = payload.detail ?? '';
    } catch {
      // The server may return an empty or non-JSON error response.
    }
    if (response.status === 401) throw new Error('Сервис транскрибации не настроен. Сообщите владельцу сайта.');
    if (response.status === 413) throw new Error('Файл превышает допустимый размер 100 МБ.');
    if (response.status === 503) throw new Error(detail || 'Сервис транскрибации временно недоступен.');
    throw new Error(detail || 'Не удалось обработать файл. Попробуйте ещё раз.');
  }

  return response.json() as Promise<TranscriptionResult>;
}

export async function getTranscriptionHistory(): Promise<TranscriptionHistoryItem[]> {
  const response = await fetch('/api/transcriptions', { cache: 'no-store' });
  if (!response.ok) throw new Error('Не удалось загрузить историю.');
  const payload = await response.json() as { items?: TranscriptionHistoryItem[] };
  return payload.items ?? [];
}

export async function deleteTranscriptionHistoryItem(id: string): Promise<void> {
  const response = await fetch(`/api/transcriptions/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Не удалось удалить расшифровку.');
}
