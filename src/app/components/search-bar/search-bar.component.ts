import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
  
@Output() searchEvent = new EventEmitter<void>();

  emitSearch() {
    this.searchEvent.emit();
  }
}