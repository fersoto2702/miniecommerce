import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `<div *ngIf="visible" class="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded">{{ message }}</div>`
})
export class ToastComponent {
  visible = false; message = '';
  show(msg:string, time:number=3000) { this.message = msg; this.visible = true; setTimeout(()=> this.visible=false, time); }
}