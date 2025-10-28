import { Injectable } from '@angular/core';

@Injectable({
  // *** this tells Angular to create a single instance of this service
  // and make it available across the entire application (a singleton)
  providedIn: 'root'
})
export class BakingService {

  constructor() {
    console.log('***** BakingService initialized *****');
  }


}
