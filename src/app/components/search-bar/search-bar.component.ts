import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {

  term: string = ''; // <-- aquí se guarda el texto del input

  @Output() searchEvent = new EventEmitter<string>();

  emitSearch() {
    this.searchEvent.emit(this.term);  // <-- enviamos el texto al padre
  }
}
