import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, SnackbarService } from '@app/core/services';
import { Gender } from '@app/core/models';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['.././auth.css'],
})
export class RegisterComponent {
  
  form = new FormGroup({
    email: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.email] }),
    firstName: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    birthDate: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    gender: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    nationality: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    socialSecurityNumber: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.minLength(13), Validators.maxLength(13), /* Validators.pattern(""/[12][0-9]{2}(0[1-9]|1[0-2])(2[AB]|[0-9]{2})[0-9]{3}[0-9]{3}([0-9]{2})/") */ ] }),
  });
  isForeigner: boolean = false;
  previousSocialSecurityNumber: string = "";

  readonly genders: any = [
    { value: Gender.MALE, viewValue: "Masculin" },
    { value: Gender.FEMALE, viewValue: "Féminin" },
  ]
  readonly nationalities: string[] = [
    "Afghanistan",
    "Afrique du Sud",
    "Albanie",
    "Algérie",
    "Allemagne",
    "Andorre",
    "Angola",
    "Antigua-et-Barbuda",
    "Arabie Saoudite",
    "Argentine",
    "Arménie",
    "Australie",
    "Autriche",
    "Azerbaïdjan",
    "Bahamas",
    "Bahreïn",
    "Bangladesh",
    "Barbade",
    "Belgique",
    "Belize",
    "Bénin",
    "Bhoutan",
    "Biélorussie",
    "Birmanie (Myanmar)",
    "Bolivie",
    "Bosnie-Herzégovine",
    "Botswana",
    "Brésil",
    "Brunei",
    "Bulgarie",
    "Burkina Faso",
    "Burundi",
    "Cambodge",
    "Cameroun",
    "Canada",
    "Cap-Vert",
    "Centrafrique",
    "Chili",
    "Chine",
    "Chypre",
    "Colombie",
    "Comores",
    "Congo (République démocratique)",
    "Congo (République du)",
    "Corée du Nord",
    "Corée du Sud",
    "Costa Rica",
    "Côte d'Ivoire",
    "Croatie",
    "Cuba",
    "Danemark",
    "Djibouti",
    "Dominique",
    "Égypte",
    "Émirats arabes unis",
    "Équateur",
    "Érythrée",
    "Espagne",
    "Estonie",
    "États-Unis",
    "Éthiopie",
    "Fidji",
    "Finlande",
    "France",
    "Gabon",
    "Gambie",
    "Géorgie",
    "Ghana",
    "Grèce",
    "Grenade",
    "Guatemala",
    "Guinée",
    "Guinée équatoriale",
    "Guinée-Bissau",
    "Guyana",
    "Haïti",
    "Honduras",
    "Hongrie",
    "Îles Cook",
    "Îles Marshall",
    "Îles Salomon",
    "Inde",
    "Indonésie",
    "Iran",
    "Iraq",
    "Irlande",
    "Islande",
    "Israël",
    "Italie",
    "Jamaïque",
    "Japon",
    "Jordanie",
    "Kazakhstan",
    "Kenya",
    "Kirghizistan",
    "Kiribati",
    "Koweït",
    "Laos",
    "Lesotho",
    "Lettonie",
    "Liban",
    "Liberia",
    "Libye",
    "Liechtenstein",
    "Lituanie",
    "Luxembourg",
    "Macédoine du Nord",
    "Madagascar",
    "Malaisie",
    "Malawi",
    "Maldives",
    "Mali",
    "Malte",
    "Maroc",
    "Maurice",
    "Mauritanie",
    "Mexique",
    "Micronésie",
    "Moldavie",
    "Monaco",
    "Mongolie",
    "Monténégro",
    "Mozambique",
    "Namibie",
    "Nauru",
    "Népal",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norvège",
    "Nouvelle-Zélande",
    "Oman",
    "Ouganda",
    "Ouzbékistan",
    "Pakistan",
    "Palaos",
    "Palestine",
    "Panama",
    "Papouasie-Nouvelle-Guinée",
    "Paraguay",
    "Pays-Bas",
    "Pérou",
    "Philippines",
    "Pologne",
    "Portugal",
    "Qatar",
    "République dominicaine",
    "République tchèque",
    "Roumanie",
    "Royaume-Uni",
    "Russie",
    "Rwanda",
    "Saint-Christophe-et-Niévès",
    "Saint-Marin",
    "Saint-Vincent-et-les-Grenadines",
    "Sainte-Lucie",
    "Salvador",
    "Samoa",
    "São Tomé-et-Principe",
    "Sénégal",
    "Serbie",
    "Seychelles",
    "Sierra Leone",
    "Singapour",
    "Slovaquie",
    "Slovénie",
    "Somalie",
    "Soudan",
    "Soudan du Sud",
    "Sri Lanka",
    "Suède",
    "Suisse",
    "Suriname",
    "Swaziland",
    "Syrie",
    "Tadjikistan",
    "Tanzanie",
    "Tchad",
    "Thaïlande",
    "Timor oriental",
    "Togo",
    "Tonga",
    "Trinité-et-Tobago",
    "Tunisie",
    "Turkménistan",
    "Turquie",
    "Tuvalu",
    "Ukraine",
    "Uruguay",
    "Vanuatu",
    "Vatican",
    "Venezuela",
    "Viêt Nam",
    "Yémen",
    "Zambie",
    "Zimbabwe",
  ];

  constructor(
    private _ngxService: NgxUiLoaderService,
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private _router: Router,
  ) {}

  protected onSubmit(): void {
    /* Validate the form */
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    this._ngxService.start();
    /* Get form data */
    const registerData = {
      email: this.form.value.email,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      birthDate: this.formatBirthDate(String(this.form.value.birthDate)),
      gender: this.form.value.gender,
      nationality: this.form.value.nationality,
      socialSecurityNumber: this.isForeigner ? "99" : this.form.controls.socialSecurityNumber.value,
    };
    /* Submit form */
    this._authService.register(registerData).subscribe({
      next: (response) => {
        console.log(response);
        this._ngxService.stop();
        this._snackbarService.openSnackbar(response.message);
        this._router.navigate(["/auth/login"]);
      },
      error: (err) => {
        console.log(err);
        this._ngxService.stop();
        this._snackbarService.openSnackbar(err.error.message);
      },
    });
  }

  protected onToggleForeigner(): void {
    /* Change form field SocialSecurityNumber behavior */
    this.isForeigner = !this.isForeigner;
    if (this.isForeigner) {
      if (this.form.value.socialSecurityNumber) {
        this.previousSocialSecurityNumber = this.form.value.socialSecurityNumber;
      }
      this.form.patchValue({socialSecurityNumber: "99"});
      this.form.controls.socialSecurityNumber.disable();
    }
    else {
      this.form.controls.socialSecurityNumber.enable();
      this.form.patchValue({socialSecurityNumber: this.previousSocialSecurityNumber});
    }
  }

  private formatBirthDate(inputDate: string): string {
    /* Format the input date to YYYY-MM-DD string */
    const dateObject = new Date(inputDate);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');
    const formattedDate = year+"-"+month+"-"+day;
    return formattedDate;
  }

}
