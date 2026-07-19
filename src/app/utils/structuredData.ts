export function setJsonLd(id: string, data: Record<string, unknown>) {
  let script = document.querySelector<HTMLScriptElement>(`script[data-schema-id="${id}"]`);

  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.schemaId = id;
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);

  return () => {
    script?.remove();
  };
}
