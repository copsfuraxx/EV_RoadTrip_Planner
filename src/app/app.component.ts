import { Component, ViewChild, ElementRef } from '@angular/core';
import { VilleService } from './services/ville.service';
import { SoapService } from './services/soap.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private soapService: SoapService, private villeService: VilleService) { }
  @ViewChild('dep') dep!: ElementRef;
  @ViewChild('arr') arr!: ElementRef;

  title = 'EV_RoadTrip_Planner';

  dureeH : number = 0;
  dureeM : number = 0;
  vitMoy = 60.0;
  villeDep:any
  villeArr:any

  ngOnInit(): void {

  }

  click() {
    this.villeService.GetVille(this.dep.nativeElement.value).subscribe((gps) => {
      this.villeDep = gps[0];
      this.dep.nativeElement.value = gps[0].display_name;
      if (this.villeArr != null) {
        this.SoapRequest()
      }
    })
    this.villeService.GetVille(this.arr.nativeElement.value).subscribe((gps) => {
      this.villeArr = gps[0];
      this.arr.nativeElement.value = gps[0].display_name;
      if (this.villeDep != null) {
        this.SoapRequest()
      }
    })
  }

  SoapRequest() {
    this.soapService.GetTrajectTime(100.0, .0, 0, this.vitMoy).subscribe((response) => {
      let duree = this.soapService.ParseSoap(response);
      this.dureeH = Math.floor(duree)
      this.dureeM = Math.floor((duree - this.dureeH) * 60)
    });
  }
}
