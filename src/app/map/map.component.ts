import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { BornesService } from '../services/bornes.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input()
  get villeDep(): string { return this._villeDep; }
  set villeDep(ville: any) {
    this._villeDep = ville;
    this.bound();
    this.creatRoad();
  }
  private _villeDep:any;

  @Input()
  get villeArr(): string { return this._villeArr; }
  set villeArr(ville: any) {
    this._villeArr = ville;
    this.bound();
    this.creatRoad();
  }
  private _villeArr:any;

  @Input()
  get autonomie(): number { return this._autonomie; }
  set autonomie(dist: number) {
    this._autonomie = dist;
    this.creatRoad();
  }
  private _autonomie:number = -1;

  @Output() nbArret = new EventEmitter<number>();
  @Output() dist = new EventEmitter<number>();

  map!:L.Map;
  fakeMap!:L.Map;

  route!:L.Routing.Control

  constructor(private bornesService:BornesService) {
  }

  ngOnInit() {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(this.map);
    this.fakeMap = L.map(document.createElement('div'));
  }

  bound(){
    if(this._villeDep == null || this._villeArr == null) return;
    this.map.fitBounds([
      [this._villeDep.lat, this._villeDep.lon],
      [this._villeArr.lat, this._villeArr.lon]
  ]);
  }

  creatRoad(){
    if(this._villeDep == null || this._villeArr == null || this._autonomie == -1) return;
    this.fakeMap.eachLayer((layer) => {
      layer.remove();
    });
    let _route = L.Routing.control({
      waypoints: [
        L.latLng(this._villeDep.lat, this._villeDep.lon),
        L.latLng(this._villeArr.lat, this._villeArr.lon)
      ]
    });
    _route.on("routesfound",(e) => this.creatRoad2(e));
    _route.addTo(this.fakeMap!);
  }

  async creatRoad2(e:any) {
    if (this.route != null) {
      this.map.removeControl(this.route);
    }
    let indexs = this.calculIndexArray(e.routes[0].summary.totalDistance, this._autonomie * 1000, e.routes[0].waypointIndices[1]);
    this.nbArret.emit(indexs.length);
    this.dist.emit(e.routes[0].summary.totalDistance / 1000);
    let waypoints = [];
    waypoints.push(L.latLng(this._villeDep.lat, this._villeDep.lon));
    for (let i = 0; i < indexs.length; i++) {
      let coord = e.routes[0].coordinates[indexs[i]]
      let bornes = await this.bornesService.GetBornes(coord["lat"],coord["lng"], 100000).toPromise();
      let borne = bornes['records'][0]['fields']["geo_point_borne"]
      waypoints.push(L.latLng(borne[0], borne[1]));
    }
    waypoints.push(L.latLng(this._villeArr.lat, this._villeArr.lon));
    let _route = L.Routing.control({
      waypoints: waypoints
    });
    _route.addTo(this.map);
    //this.fakeMap = null;
    this.route = _route;
  }

  calculIndexArray(distance: number, autonomy: number, lengthCoords: number) {
    if (autonomy < distance) {
      const nbReloads = Math.ceil(distance / autonomy);
      let index = lengthCoords / nbReloads;
      if (index < 0)
        index = 0;
      else
        index = Math.floor(index);

      // Tableau index
      let arrayIndex: any = [];
      for (let i = 1; i <= nbReloads; i++) {
        arrayIndex.push(index * i);
      }
      return arrayIndex;
    }
    return [];
  }
}
