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
