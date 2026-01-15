import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {

  term: string = '';
  showResults = false;
  showSuggestions = false;

  // Sugerencias de búsqueda populares (opcional)
  suggestions = [
    'Pikachu',
    'Charizard',
    'Squirtle',
    'Pokéballs',
    'Juegos'
  ];

  @Output() searchEvent = new EventEmitter<string>();

  // Emitir búsqueda al presionar Enter o click en botón
  emitSearch() {
    if (this.term.trim()) {
      this.searchEvent.emit(this.term.trim());
      this.showResults = true;
      this.showSuggestions = false;

      // Ocultar mensaje de resultados después de 2 segundos
      setTimeout(() => {
        this.showResults = false;
      }, 2000);
    }
  }

  // Limpiar búsqueda
  clearSearch() {
    this.term = '';
    this.searchEvent.emit('');
    this.showResults = false;
  }

  // Búsqueda en tiempo real mientras escribe (opcional)
  onInputChange() {
    if (this.term.length >= 3) {
      this.searchEvent.emit(this.term.trim());
    }

    // Si borra todo, resetear búsqueda
    if (!this.term) {
      this.searchEvent.emit('');
      this.showResults = false;
    }
  }

  // Seleccionar sugerencia rápida
  selectSuggestion(suggestion: string) {
    this.term = suggestion;
    this.emitSearch();
  }

  // Toggle sugerencias
  toggleSuggestions() {
    this.showSuggestions = !this.showSuggestions && !this.term;
  }
}