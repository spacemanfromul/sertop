export type ApplicationStatus = 'Черновик' | 'Отправлено' | 'Интервью' | 'Тестовое' | 'Оффер' | 'Отказ';

export type JobApplication = {
  id: string;
  date: string;
  company: string;
  segment: 'B2B' | 'B2C';
  position: string;
  status: ApplicationStatus;
  rejectionStage: string;
  rejectionReason: string;
  salary: string;
  link: string;
  contact: string;
  notes: string;
};

const row = (id: string, date: string, company: string, segment: 'B2B' | 'B2C', position: string, status: ApplicationStatus, extras: Partial<JobApplication> = {}): JobApplication => ({
  id, date, company, segment, position, status, rejectionStage: '', rejectionReason: '', salary: '', link: '', contact: '', notes: '', ...extras,
});

export const initialApplications: JobApplication[] = [
  row('vk', '2026-07-08', 'ВКонтакте', 'B2C', 'Старший продуктовый дизайнер', 'Отказ', { rejectionStage: 'Скрининг HR', salary: '-', link: 'https://team.vk.company/vacancy/37115/', contact: '-', notes: 'Отклик с сопроводительным письмом' }),
  row('2gis', '2026-07-08', '2ГИС', 'B2C', 'Продуктовый дизайнер', 'Отказ', { rejectionStage: 'Скрининг HR', salary: '-', link: 'https://job.2gis.ru/vacancies/design/46', contact: 'Анна Прокудина', notes: 'Сопроводительное письмо и портфолио' }),
  row('t2', '2026-07-08', 't2', 'B2C', 'Дизайнер интерфейсов цифровых продуктов', 'Отказ', { rejectionStage: 'Скрининг HR', salary: '-', link: 'https://msk.t2.ru/vacancy/4945#', notes: 'Через Виктора' }),
  row('sber-devices', '2026-07-08', 'СБЕР (SberDevices)', 'B2C', 'Продуктовый дизайнер', 'Отказ', { rejectionStage: 'Скрининг HR', notes: 'Через Артура' }),
  row('sber-tech', '2026-07-08', 'СберТех', 'B2C', 'Продуктовый дизайнер', 'Отказ', { rejectionStage: 'Скрининг HR', notes: 'Через Артура' }),
  row('gazprom', '2026-07-09', 'ООО «Газпром информ»', 'B2B', 'Дизайнер middle UX/UI', 'Отказ', { rejectionStage: 'Скрининг HR', rejectionReason: 'Отклик на HH просмотрен, без ОС', link: 'https://spb.hh.ru/vacancy/134988828', contact: 'Евгений Васильев', notes: 'Отклик на HH + письмо на почту' }),
  row('whoosh', '2026-07-09', 'Whoosh', 'B2B', 'Продуктовый дизайнер', 'Отказ', { salary: '-', link: 'https://whoosh-bike.ru/tpost/je5pjyjx41-produktovii-dizainer', contact: 'Владислав Фишман', notes: 'Сопроводительное письмо и портфолио' }),
  row('runity', '2026-07-09', 'Рунити', 'B2B', 'Продуктовый дизайнер в Рег.облако', 'Отказ', { rejectionStage: 'Скрининг HR', rejectionReason: 'Вакансия перенесена в архив', link: 'https://spb.hh.ru/vacancy/134498049', notes: 'Отклик на HH' }),
  row('avito', '2026-07-09', 'АвитоТех', 'B2B', 'Ведущий дизайнер продукта в Работу', 'Отказ', { link: 'https://career.avito.com/vacancies/dizayn/19703/', notes: 'Отклик на сайте' }),
  row('mws', '2026-07-09', 'MWS', 'B2B', 'Senior Product Experience Designer', 'Отказ', { rejectionReason: 'Вакансия закрыта', link: 'https://job.mts.ru/vacancy/646291229385951435', contact: 'Евгений Сорокин', notes: 'Сопроводительное письмо и портфолио' }),
  row('kontur', '2026-07-10', 'Контур', 'B2B', 'Продуктовый дизайнер, middle+/senior', 'Отказ', { link: 'https://kontur.ru/career/vacancies/5783', notes: 'Уточнил возможность удалённой работы' }),
  row('aviasales', '2026-07-10', 'Авиасейлс', 'B2C', 'Middle Product Designer', 'Отказ', { link: 'https://www.aviasales.ru/about/vacancies/4263600' }),
  row('gs-labs', '2026-07-10', 'GS Labs', 'B2B', 'UX/UI дизайнер', 'Отказ', { link: 'https://hh.ru/vacancy/134906439', notes: 'Через сайт' }),
  row('tbank', '2026-07-10', 'ТБанк', 'B2B', 'Продуктовый дизайнер', 'Отказ', { link: 'https://www.tbank.ru/career/it/vacancy/moscow/product-designer/cc123a1e-92e7-4480-9f3d-00f66c350d06/', notes: 'Через сайт и через Машу' }),
  row('vseinstrumenti', '2026-07-13', 'Все инструменты', 'B2C', 'Senior Product Designer', 'Отказ', { rejectionStage: 'Скрининг HR', rejectionReason: 'Отклик в HH не просмотрен', link: 'https://hh.ru/vacancy/135020284', notes: 'Отклик на HH' }),
  row('sber-insurance', '2026-07-20', 'СберСтрахование / Selecty', 'B2C', '', 'Отказ', { rejectionStage: 'Скрининг HR', rejectionReason: 'Хотели видеть более нагруженные решения', contact: 'Елена Чуйко', notes: 'Отклик после скрининга агентства' }),
  row('sber-health', '2026-07-21', 'СберЗдоровье', 'B2C', '', 'Отказ', { contact: 'Маргарита Т', notes: 'Нашёл пост в LinkedIn' }),
  row('moex', '2026-07-31', 'Московская биржа', 'B2C', 'Product Designer', 'Отказ', { notes: 'Нашёл пост в LinkedIn' }),
  row('ozon', '2026-08-02', 'OZON', 'B2B', 'Стажёр', 'Отправлено', { notes: 'Карьерный сайт' }),
  row('idigital', '2026-08-05', 'i-Digital', 'B2C', 'Product Designer', 'Отправлено', { notes: 'HH' }),
];
