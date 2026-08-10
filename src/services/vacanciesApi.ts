export type VacancyImportData = {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  salary: string;
  url: string;
};

export type VacancyImportErrorCode = 'invalid_url' | 'vacancy_not_found' | 'backend_unavailable' | 'not_configured';

export class VacancyImportError extends Error {
  constructor(public code: VacancyImportErrorCode) {
    super(code);
  }
}

type VacancyApiResponse = {
  id?: string | number;
  title?: string;
  company?: string;
  company_logo?: string | null;
  salary?: string | number | { from?: number | null; to?: number | null; currency?: string | null } | null;
  url?: string;
};

function extractVacancyId(value: string) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error();
    if (url.hostname !== 'hh.ru' && !url.hostname.endsWith('.hh.ru')) throw new Error();
    const id = url.pathname.match(/\/vacancy\/(\d+)/)?.[1];
    if (!id) throw new Error();
    return id;
  } catch {
    throw new VacancyImportError('invalid_url');
  }
}

function formatSalary(salary: VacancyApiResponse['salary']) {
  if (salary === null || salary === undefined) return '';
  if (typeof salary === 'string' || typeof salary === 'number') return String(salary);
  const currency = salary.currency ? ` ${salary.currency}` : '';
  if (salary.from && salary.to) return `${salary.from.toLocaleString('ru-RU')}–${salary.to.toLocaleString('ru-RU')}${currency}`;
  if (salary.from) return `от ${salary.from.toLocaleString('ru-RU')}${currency}`;
  if (salary.to) return `до ${salary.to.toLocaleString('ru-RU')}${currency}`;
  return '';
}

export async function importVacancy(url: string): Promise<VacancyImportData> {
  const vacancyId = extractVacancyId(url);
  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
  const apiKey = import.meta.env.VITE_VACANCIES_API_KEY;
  if (!apiUrl || !apiKey) throw new VacancyImportError('not_configured');

  let response: Response;
  try {
    response = await fetch(`${apiUrl}/api/vacancy/${vacancyId}`, {
      headers: { 'X-API-Key': apiKey },
    });
  } catch {
    throw new VacancyImportError('backend_unavailable');
  }

  if (response.status === 404) throw new VacancyImportError('vacancy_not_found');
  if (response.status === 400 || response.status === 422) throw new VacancyImportError('invalid_url');
  if (!response.ok) throw new VacancyImportError('backend_unavailable');

  const data = await response.json() as VacancyApiResponse;
  if (!data.title && !data.company) throw new VacancyImportError('vacancy_not_found');

  return {
    id: String(data.id || vacancyId),
    title: data.title || '',
    company: data.company || '',
    companyLogo: data.company_logo || '',
    salary: formatSalary(data.salary),
    url: data.url || url.trim(),
  };
}
