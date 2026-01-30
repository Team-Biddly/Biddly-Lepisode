export interface Item {
  id: string;
  type: string;
  title: string;
  detail: string;
  manager: string;
  agency: string;
  budget: string;
  createdAt: string;
  period: string;
  keywords: string[];
}

export const ITEMS: Item[] = [
  {
    id: '1',
    type: '기술용역',
    title: '(사업명)소고리 도시생태축 복원사업',
    detail: '내자',
    manager: '장민호',
    agency: '경기도 이천시 환경정책과',
    budget: '174,734,400원',
    createdAt: '2025-07-29',
    period: '2025-07',
    keywords: ['도시생태', '경기이천시', '복원사업', '녹지계획', '환경조사'],
  },
  {
    id: '2',
    type: '공사',
    title: '(사업명)소고리 도시생태축 복원사업',
    detail: '외자',
    manager: '장민호',
    agency: '경기도 이천시 환경정책과',
    budget: '174,734,400원',
    createdAt: '2025-07-29',
    period: '2025-07',
    keywords: ['도시생태', '경기이천시', '복원사업', '환경정비'],
  },
  {
    id: '3',
    type: '일반입찰',
    title: '(사업명)소고리 도시생태축 복원사업',
    detail: '-',
    manager: '장민호',
    agency: '경기도 이천시 환경정책과',
    budget: '174,734,400원',
    createdAt: '2025-07-29',
    period: '2025-07',
    keywords: ['도시재생', '녹지관리', '경기이천시'],
  },
  {
    id: '4',
    type: '긴급 입찰',
    title: '(사업명)소고리 도시생태축 복원사업',
    detail: '-',
    manager: '장민호',
    agency: '경기도 이천시 환경정책과',
    budget: '174,734,400원',
    createdAt: '2025-07-29',
    period: '2025-07',
    keywords: ['자연복원', '공원계획', '생태복원'],
  },
  {
    id: '5',
    type: '민간 공사',
    title: '(사업명)소고리 도시생태축 복원사업',
    detail: '-',
    manager: '장민호',
    agency: '경기도 이천시 환경정책과',
    budget: '174,734,400원',
    createdAt: '2025-07-29',
    period: '2025-07',
    keywords: ['민간참여', '도시개발', '경기이천시'],
  },
  {
    id: '6',
    type: '기타',
    title: '(사업명)소고리 도시생태축 복원사업',
    detail: '-',
    manager: '장민호',
    agency: '경기도 이천시 환경정책과',
    budget: '174,734,400원',
    createdAt: '2025-07-29',
    period: '2025-07',
    keywords: ['기타사업', '지속가능성', '환경'],
  },
];
