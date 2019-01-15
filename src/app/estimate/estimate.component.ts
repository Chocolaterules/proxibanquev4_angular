import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.css']
})
export class EstimateComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
  }

  goToUrl(): void {
    this.document.location.href = 'https://fr.wikipedia.org/';
  }

}
