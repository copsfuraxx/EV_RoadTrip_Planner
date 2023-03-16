import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CostService {
  private url = 'https://api-rest-info802.vercel.app/cost';
  private options = { responseType: 'text' as 'json' };
  constructor(private http: HttpClient) { }

  getCostTrajet(dist:number) {
    return this.http.post<any>(this.url, {distance:dist}, this.options);
  }
}
