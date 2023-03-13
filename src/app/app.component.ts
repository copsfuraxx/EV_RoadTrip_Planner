import { Component, ViewChild, ElementRef } from '@angular/core';
import { VilleService } from './services/ville.service';
import { SoapService } from './services/soap.service';
import { VoitureService } from './services/voiture.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private soapService: SoapService, private villeService: VilleService, private voitureService: VoitureService) { }
  @ViewChild('dep') dep!: ElementRef;
  @ViewChild('arr') arr!: ElementRef;
  @ViewChild('select') select!: ElementRef;
  @ViewChild('voiture') voiture!: ElementRef;

  title = 'EV_RoadTrip_Planner';

  dureeH : number = 0;
  dureeM : number = 0;
  vitMoy = 110.0;
  villeDep:any;
  villeArr:any;
  nbArret:number = -1;
  dist:number = -1;
  listVoiture:Array<any> = [];
  autonomie:number = -1;

  ngOnInit(): void {

  }

  click() {
    this.nbArret = -1;
    this.dist = -1;
    this.villeService.GetVille(this.dep.nativeElement.value).subscribe((gps) => {
      //console.log(gps);
      this.villeDep = gps[0];
      this.dep.nativeElement.value = gps[0].display_name;
      if (this.villeArr != null && this.nbArret != -1 && this.dist != -1) {
        this.SoapRequest()
      }
    })

    this.villeService.GetVille(this.arr.nativeElement.value).subscribe((gps) => {
      this.villeArr = gps[0];
      this.arr.nativeElement.value = gps[0].display_name;
      if (this.villeDep != null && this.nbArret != -1 && this.dist != -1) {
        this.SoapRequest()
      }
    })

    this.autonomie = this.listVoiture[this.select.nativeElement.value]['range']['chargetrip_range']['worst'];
    //console.log(this.listVoiture[this.select.nativeElement.value]);//range.chargetrip_range.worst
  }

  SoapRequest() {
    this.soapService.GetTrajectTime(this.dist, 0.5, this.nbArret, this.vitMoy).subscribe((response) => {
      let duree = this.soapService.ParseSoap(response);
      this.dureeH = Math.floor(duree);
      this.dureeM = Math.floor((duree - this.dureeH) * 60);
    });
  }

  changeNbArret(nb:number) {
    this.nbArret = nb;
    if (this.villeDep != null && this.villeArr != null && this.dist != -1) {
      this.SoapRequest()
    }
  }

  changeDist(nb:number) {
    this.dist = nb;
    if (this.villeDep != null && this.villeArr != null  && this.nbArret != -1) {
      this.SoapRequest()
    }
  }

  selectMarque(){
    //console.log(this.listVoiture[this.select.nativeElement.value]);
    this.voitureService.findVehicule(this.voiture.nativeElement.value).subscribe( (voitures) => {
      this.listVoiture = voitures['data']['vehicleList'];
      this.select.nativeElement.innerHTML = "<option>Model voiture</option>";
      let i = 0;
      this.listVoiture.forEach((elem:any) => {
        let option = document.createElement('option');
        option.value = i.toString();
        i++;
        option.innerText = elem['naming']['make'] + ' ' + elem['naming']['model'] + ' ' + elem['naming']['version'];
        this.select.nativeElement.appendChild(option);
      });
    })
  }
}
