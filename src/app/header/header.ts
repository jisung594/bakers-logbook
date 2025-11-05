import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false, // why does setting to 'true' cause build to fail?
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

}
