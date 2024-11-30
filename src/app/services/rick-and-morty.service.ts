import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root',
})
export class RickAndMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene una lista de personajes con un límite especificado.
   * @param limit Número máximo de personajes a obtener.
   * @param page Página de resultados.
   * @returns Un observable que emite la respuesta de la API con los personajes.
   */
  getCharacterList(page: number): Observable<any> {
    const apiUrl = `${this.apiUrl}?page=${page}`;
    return this.http.get<any>(apiUrl);
  }
  


  /**
   * Obtiene los detalles de un personaje por su ID.
   * @param id ID del personaje.
   * @returns Un observable que emite los detalles del personaje.
   */
  getCharacterDetails(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`);
  }
}

