import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BornesService {
  //https://odre.opendatasoft.com/api/records/1.0/search/?dataset=bornes-irve&q=&lang=fr&rows=1&facet=region&facet=departement&geofilter.distance=48.8520930694%2C2.34738897685%2C1000
  url = 'https://odre.opendatasoft.com/api/records/1.0/search/?dataset=bornes-irve&rows=1&geofilter.distance=';

  constructor(private http:HttpClient) { }

  GetBornes(lat:number, long:number, dist:number){
    return this.http.get<any>(this.url + lat + '%2C' + long + '%2C' + dist);
  }
}
