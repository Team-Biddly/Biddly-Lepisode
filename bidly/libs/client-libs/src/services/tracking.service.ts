import { Injectable } from '@angular/core';
import { IRequestVisitor } from '@common';

type RequestIpResult = {
  IPv4: string;
  city: string;
  country_code: string;
  country_name: string;
  latitude: number;
  longitude: number;
  postal: string;
  state: string;
};

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  /**
   * 방문자 추적
   * @param baseUrl
   * @returns
   */
  async trackVisitor(baseUrl: string) {
    const lastVisit = localStorage.getItem('lastVisitDate');
    const today = new Date().toISOString().split('T')[0];

    if (lastVisit === today) {
      return;
    }

    const requestIp = await fetch('https://geolocation-db.com/json/');
    const ip: RequestIpResult = await requestIp.json();
    const url = `${baseUrl}/api/visitor`;

    const pageUrl = window.location.pathname;
    const referrer = document.referrer || 'direct';
    const body: IRequestVisitor = {
      pageUrl,
      referrer,
      city: ip.city,
      nation: ip.country_name,
      ip: ip.IPv4,
    };

    const req = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const res = await req.json();
    localStorage.setItem('lastVisitDate', today);
  }
}
