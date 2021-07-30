import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.eu/rest/v2/';
  private _filters: string = '?fields=alpha3Code;name'
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones():string[]{
    return [...this._regiones];
  }

  constructor(
    private http: HttpClient
  ) { }

  getPaisesPorRegion(region: string):Observable<PaisSmall[]>{
    const url: string = `${this._baseUrl}region/${region}${this._filters}`;
    console.log(url);
    
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo(codigo: string):Observable<Pais | null>{
    if(!codigo.trim()){
      return of(null);
    }
    const url: string = `${this._baseUrl}alpha/${codigo.trim()}`;
    return this.http.get<Pais>(url);
  }

  getPaisPorCodigoSmall(codigo: string):Observable<PaisSmall>{
   
    const url: string = `${this._baseUrl}alpha/${codigo.trim()}${this._filters}`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigos(borders: string[]):Observable<PaisSmall[]>{
   
    if(!borders){
      return of([]);
    }
    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach(codigo=>{
      const peticion= this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest( peticiones );

  }
}
