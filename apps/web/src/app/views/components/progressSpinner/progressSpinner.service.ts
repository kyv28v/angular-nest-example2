import { ComponentRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ProgressSpinnerComponent } from './progressSpinner.component';

@Injectable({
  providedIn: 'root'
})
export class ProgressSpinnerService {

  overlayRef: OverlayRef;
  spinner: ComponentRef<ProgressSpinnerComponent>;

  constructor(
    private readonly overlay: Overlay,
    public translate: TranslateService,
  ) {}

  // show progress spinner
  public show(): void {
    const portal = new ComponentPortal(ProgressSpinnerComponent);

    this.overlayRef = this.overlay.create({
      width: '100%',
      height: '100%',
      hasBackdrop: true,
      panelClass: 'progress-spinner',
      backdropClass: 'progress-spinner-backdrop',
    });
    this.spinner = this.overlayRef.attach(portal);
  }

  public close(): void {
    this.overlayRef.detach();
    this.overlayRef.dispose();
  }

  public setMessage(message: string): void {
    this.spinner.instance.message = this.translate.instant(message);
  }
}