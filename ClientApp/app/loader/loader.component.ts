import { Component, OnInit } from '@angular/core';

@Component({
 
  selector: 'app-loader',
  template: `
    <img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />
    `,
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  name: string;
  constructor() { }

  ngOnInit() {
  }

}
