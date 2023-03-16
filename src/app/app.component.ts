import { Component, ViewChild, ElementRef } from '@angular/core';
import { VilleService } from './services/ville.service';
import { SoapService } from './services/soap.service';
import { VoitureService } from './services/voiture.service';
import { CostService } from './services/cost.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private soapService: SoapService, private villeService: VilleService,
    private voitureService: VoitureService, private costService: CostService) { }
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
  cost:number = 0;

  ngOnInit(): void {

  }

  click() {
    this.nbArret = -1;
    this.dist = -1;
    this.cost = 0;
    this.dureeH = 0;
    this.dureeM = 0;
    this.villeArr = null;
    this.villeDep = null;
    this.villeService.GetVille(this.dep.nativeElement.value).subscribe((gps) => {
      if(gps.length > 0) {
        this.villeDep = gps[0];
        //this.dep.nativeElement.value = gps[0].display_name;
      }
      if (this.villeArr != null && this.nbArret != -1 && this.dist != -1) {
        this.SoapRequest()
      }
    })

    this.villeService.GetVille(this.arr.nativeElement.value).subscribe((gps) => {
      if(gps.length > 0) {
        this.villeArr = gps[0];
        //this.arr.nativeElement.value = gps[0].display_name;
      }
      if (this.villeDep != null && this.nbArret != -1 && this.dist != -1) {
        this.SoapRequest()
      }
    })

    this.autonomie = this.listVoiture[this.select.nativeElement.value]['range']['chargetrip_range']['worst'];
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
    this.restRequest();
    if (this.villeDep != null && this.villeArr != null  && this.nbArret != -1) {
      this.SoapRequest()
    }
  }

  restRequest() {
    this.costService.getCostTrajet(this.dist).subscribe((response) => {
      this.cost = JSON.parse(response).cost;
    });
  }

  selectMarque(){
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
