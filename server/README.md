# Portfolio analytics API

The site remains static. This small Node.js service keeps the Yandex Metrica OAuth token on the server and exposes only aggregated data at `/api/analytics`.

1. Set `YANDEX_METRIKA_TOKEN`, `YANDEX_COUNTER_ID` and optionally `ANALYTICS_PORT` in the server environment.
2. Start with `npm run analytics:serve` under a process manager or systemd.
3. Proxy `/api/analytics` from Nginx to `http://127.0.0.1:8787/api/analytics`.

```nginx
location = /api/analytics {
    proxy_pass http://127.0.0.1:8787/api/analytics;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

The service caches Yandex responses for 15 minutes. Do not put the OAuth token in Vite variables or any `VITE_*` variable.

## Transcription proxy

The same Node.js service proxies `POST /api/transcribe` so the transcription API key is never exposed to the browser.

1. Add `TRANSCRIPTION_API_KEY` to `.env.local` on the server.
2. Restart the Node.js process after changing the environment file.
3. Proxy the route in Nginx with a long timeout and a request-size limit:

```nginx
location = /api/transcribe {
    client_max_body_size 102M;

    proxy_pass http://127.0.0.1:8787/api/transcribe;
    proxy_read_timeout 600s;
    proxy_send_timeout 600s;
    proxy_request_buffering off;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

The frontend calls the same-origin `/api/transcribe` endpoint. Never use a `VITE_*` variable for `TRANSCRIPTION_API_KEY`, because Vite variables are included in the public browser bundle.

Transcription results are stored in `data/transcription-history.json` (up to 100 entries). Protect both `/api/transcribe` and `/api/transcriptions` with the same Nginx Basic Auth used for `/transcribe`. The source media files are never stored.
