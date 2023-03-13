import { Injectable } from '@angular/core';
import { Apollo, ApolloBase, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {

  private apollo: ApolloBase;
 
  constructor(private apolloProvider: Apollo) {
    this.apollo = this.apolloProvider.use('chargetrip');
  }
 
  findVehicule(search: String): Observable<any> {
    let queryListVehicule = gql`
      query queryListVehicule($search: String!) {
        vehicleList(
          search : $search
        ) {
          id
          naming {
            make
            model
            version
            edition
          }
          range {
            chargetrip_range {
              best
              worst
            }
          }
          routing {
            fast_charging_support
          }
          media {
            image {
              thumbnail_url
              thumbnail_height
              thumbnail_width
            }
          }
        }
      }
      `;
    return this.apollo.watchQuery({ 
      query: queryListVehicule,
      variables: {
        search: search
      }
    }).valueChanges;
  }

}