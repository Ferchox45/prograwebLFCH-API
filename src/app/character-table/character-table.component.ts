import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { RickAndMortyService } from '../services/rick-and-morty.service';
import { Character } from '../models/character.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-character-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, NgxPaginationModule, FormsModule],
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.css'],
})
export class CharacterTableComponent implements OnInit {
  characters: Character[] = [];
  filteredCharacters: Character[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  sortDirection: 'asc' | 'desc' = 'asc';
  sortBy: 'id' | 'name' = 'id';
  selectedCharacter: Character | null = null;
  tempCharacter: Character = { id: 0, name: '', status: '', species: '', gender: '', image: '' };
  loading: boolean = true;
  totalCharacters: number = 100;
  startIndex: number = 0;
  endIndex: number = 0;

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.loading = true;
    const pagesToLoad = [1, 2, 3, 4, 5];
    const characterRequests = pagesToLoad.map((page) =>
      this.rickAndMortyService.getCharacterList(page)
    );

    forkJoin(characterRequests).subscribe({
      next: (responses) => {
        this.characters = responses.flatMap((response) => response.results);
        this.filteredCharacters = [...this.characters];
        this.updatePaginationIndices();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading characters:', error);
        this.loading = false;
      },
    });
  }

  updatePaginationIndices(): void {
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.filteredCharacters.length);
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredCharacters = this.characters.filter(
      (character) =>
        character.name.toLowerCase().includes(query) || character.id.toString().includes(query)
    );
    this.currentPage = 1;
    this.updatePaginationIndices();
  }

  sortList(): void {
    this.filteredCharacters.sort((a, b) => {
      let valueA = a[this.sortBy];
      let valueB = b[this.sortBy];
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (this.sortDirection === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortList();
  }

  changeSortField(field: 'id' | 'name'): void {
    if (this.sortBy === field) {
      this.toggleSortDirection();
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
    this.sortList();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginationIndices();
    }
  }

  nextPage(): void {
    if (this.endIndex < this.filteredCharacters.length) {
      this.currentPage++;
      this.updatePaginationIndices();
    }
  }

  openEditModal(index: number): void {
    this.tempCharacter = { ...this.filteredCharacters[index] }; // Clona el personaje seleccionado
  }
  

  saveCharacterChanges(): void {
    const index = this.characters.findIndex(
      (character) => character.id === this.tempCharacter.id
    );
    if (index !== -1) {
      this.characters[index] = { ...this.tempCharacter };
      this.filteredCharacters = [...this.characters]; // Refresca la lista filtrada
      this.updatePaginationIndices();
    }
  }
  

  openViewMoreModal(index: number): void {
    this.selectedCharacter = { ...this.filteredCharacters[index] };
  }

  confirmDeleteCharacter(index: number): void {
    Swal.fire({
      title: '¿Estás seguro de eliminar este personaje?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.filteredCharacters.splice(index, 1);
        this.updatePaginationIndices();
        Swal.fire('Eliminado', 'El personaje ha sido eliminado.', 'success');
      }
    });
  }

  goToFirstPage(): void {
    this.currentPage = 1;
    this.updatePaginationIndices();
  }
  
  goToLastPage(): void {
    this.currentPage = Math.ceil(this.filteredCharacters.length / this.pageSize);
    this.updatePaginationIndices();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCharacters.length / this.pageSize);
  }
  
}
