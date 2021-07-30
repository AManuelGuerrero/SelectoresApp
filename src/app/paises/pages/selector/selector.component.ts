import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { Pais, PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators'

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styles: [
  ]
})
export class SelectorComponent implements OnInit {

  miFormulario: FormGroup = this.formBuilder.group({
    region: ['', Validators.required],
    pais: ['',Validators.required],
    frontera: ['',Validators.required]
  });

  //llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  //fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;
    // this.miFormulario.get('region')?.valueChanges.subscribe((region)=>{
    //   this.paisesService.getPaisesPorRegion(region).subscribe(paises=>{
    //     console.log(paises);
        
    //     this.paises = paises;
    //   })
    // });

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      ).subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });

      this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap(( _ )=>{
            this.fronteras = [];
            this.miFormulario.get('frontera')?.reset('');
            this.cargando = true;
          }),
          switchMap(code=> this.paisesService.getPaisPorCodigo(code)),
          switchMap(pais =>this.paisesService.getPaisesPorCodigos(pais?.borders!))
        ).subscribe(paises=>{
          //this.fronteras = pais?.borders || [];
          this.fronteras = paises;
          this.cargando = false;
        });

  }

  guardar(){
    console.log(this.miFormulario.value);
    
  }

}
