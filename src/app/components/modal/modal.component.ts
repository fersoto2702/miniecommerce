import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 md:w-1/3">
        <button class="float-right" (click)="close()">✕</button>
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  close(){ this.open = false; this.openChange.emit(false); }
}