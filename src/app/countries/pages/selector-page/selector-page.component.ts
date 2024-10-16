import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit{

  public myForm: FormGroup;
  public countriesByRegion : SmallCountry[] = [];
  public borders: string[] = []


  constructor(
      private fb: FormBuilder,
      private countriesService: CountriesService,
  ){

    this.myForm =  this.fb.group({
      region: ['', Validators.required],
      country: ['', Validators.required],
      border : ['', Validators.required],


    })

  }

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions(): Region[] {
    return this.countriesService.regions;

  }

  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('country')!.setValue('') ),
        tap( () => this.borders = []  ),
        switchMap( (region) => this.countriesService.getCountriesByRegion( region ) )
      )
    .subscribe( countries =>{
      this.countriesByRegion = countries;
    })
  }

  onCountryChanged(): void {
    this.myForm.get('country')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('border')!.setValue('') ),
      switchMap( (alphaCode ) => this.countriesService.getCountryByAlphaCode( alphaCode ) )
    )
  .subscribe( country =>{
    //console.log({ borders: country.borders });
    this.borders = country.borders;

  })


  }


}
