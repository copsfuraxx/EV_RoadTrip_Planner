import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SoapService {
  url = 'https://soap-api-omega.vercel.app/'
  //url = 'localhost:8000/'
  bodyStart = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spy="spyne.examples.trajet.soap"><soapenv:Header/><soapenv:Body><spy:tempsMoy>'
  bodyEnd = '</spy:tempsMoy></soapenv:Body></soapenv:Envelope>'
  private options = { 
    responseType: 'text' as 'json'};
  constructor(private http: HttpClient) { }

  GetTrajectTime(distKm:number, rechargeH:number, nb_recharge:number, vitMoyKMH:number){
    let body = this.bodyStart;
    body += "<spy:distKm>";
    body += distKm;
    body += "</spy:distKm>";
    body += "<spy:vitMoyKMH>";
    body += vitMoyKMH;
    body += "</spy:vitMoyKMH>";
    body += "<spy:rechargeH>";
    body += rechargeH;
    body += "</spy:rechargeH>";
    body += "<spy:nb_recharge>";
    body += nb_recharge;
    body += "</spy:nb_recharge>";
    body += this.bodyEnd;

    console.log(body);

    return this.http.post<any>(this.url, body, this.options);
  }

  ParseSoap(response:string){
    return Number.parseFloat(response.split('<tns:tempsMoyResult>')[1]);
  }
}
