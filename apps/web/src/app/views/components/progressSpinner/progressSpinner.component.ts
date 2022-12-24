import { Component, ViewEncapsulation } from '@angular/core';

import { SharedService } from '../../../common/services/shared.service';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progressSpinner.component.html',
  styleUrls: [ './progressSpinner.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class ProgressSpinnerComponent {
  message: string;

  constructor(
    public shared: SharedService,
  ) {}
}