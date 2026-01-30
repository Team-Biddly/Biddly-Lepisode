export interface IVisitor {
  id: string;
  ip: string;
  nation: string;
  city: string;
  device: string;
  os: string;
  browser: string;
  pageUrl: string;
  referrer: string;
  createdAt: Date;
}

export interface IRequestVisitor {
  pageUrl: string;
  referrer: string;
  nation: string;
  city: string;
  ip: string;
}
