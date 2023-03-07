import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VilleService {

  constructor(private http:HttpClient) { }

  GetVille(txt:string){
    return this.http.get<any>("https://nominatim.openstreetmap.org/search?city=<"+txt+">&format=json&limit=1");
  }
}
