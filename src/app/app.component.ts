import { Component, ViewChild, ElementRef } from '@angular/core';
import { VilleService } from './services/ville.service';
import { SoapService } from './soap.service';

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

  url = '127.0.0.1:8000/';
  vitMoy = 60;
  villeDep:any
  villeArr:any

  ngOnInit(): void {

  }

  click() {
    this.villeService.GetVille(this.dep.nativeElement.value).subscribe((gps) => {
      this.villeDep = gps[0];
      this.dep.nativeElement.value = gps[0].display_name;
      if (this.villeArr != null) {
        this.SoapRequest([[this.villeDep!.lat, this.villeDep!.lon],[this.villeArr!.lat, this.villeArr!.lon]])
      }
    })
    this.villeService.GetVille(this.arr.nativeElement.value).subscribe((gps) => {
      this.villeArr = gps[0];
      this.arr.nativeElement.value = gps[0].display_name;
      if (this.villeDep != null) {
        this.SoapRequest([[this.villeDep!.lat, this.villeDep!.lon],[this.villeArr!.lat, this.villeArr!.lon]])
      }
    })
  }

  SoapRequest(bornes: Array<Array<number>>) {
    this.soapService.GetTrajectTime(bornes, this.vitMoy).subscribe((response) => {
      console.log(this.soapService.ParseSoap(response));
    });
  }
}
