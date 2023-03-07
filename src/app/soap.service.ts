import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SoapService {
  url = 'http://localhost:8000/'
  bodyStart = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spy="spyne.examples.trajet.soap"><soapenv:Header/><soapenv:Body><spy:tempsMoy>'
  bodyEnd = '</spy:tempsMoy></soapenv:Body></soapenv:Envelope>'
  private options = { responseType: 'text' as 'json' };
  constructor(private http: HttpClient) { }

  GetTrajectTime(bornes:Array<Array<number>>, vitMoy:number){
    let body = this.bodyStart;
    body += "<spy:bornes>";
    for(let borne of bornes){
      body += "<spy:doubleArray>";
      borne.forEach((coord) => {
        body += "<spy:double>";
        body += coord;
        body += "</spy:double>";
      })
      body += "</spy:doubleArray>";
    }
    body += "</spy:bornes>";
    body += "<spy:vitMoy>";
    body += vitMoy;
    body += "</spy:vitMoy>";
    body += this.bodyEnd;

    return this.http.post<string>(this.url, body, this.options);
  }

  ParseSoap(response:string){
    return Number.parseFloat(response.split('<tns:tempsMoyResult>')[1]);
  }
}
