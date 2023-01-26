import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { map, Observable, switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { VitalSign } from 'src/app/model/vitalSign';
import { PatientService } from 'src/app/service/patient.service';
import { VitalSignService } from 'src/app/service/vitalsign.service';
import { PatientDialogComponent } from '../../patient/patient-dialog/patient-dialog.component';
import { PatientComponent } from '../../patient/patient.component';

@Component({
  selector: 'app-vital-sign-edit',
  templateUrl: './vital-sign-edit.component.html',
  styleUrls: ['./vital-sign-edit.component.css']
})
export class VitalSignEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;
  patientControl: FormControl = new FormControl('', [Validators.required]);

  patients: Patient[];
  patientsFiltered$: Observable<Patient[]>;

  maxDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vitalSignService: VitalSignService,
    private patientService: PatientService,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idVitalSign': new FormControl(0),
      'patient': this.patientControl,
      'date': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'temperature': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'heartbeat': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'respiratoryRate': new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    })
   
    this.loadInitialData();

    this.patientsFiltered$ = this.patientControl.valueChanges.pipe(map(val => this.filterPatients(val)));
  }
  
  filterPatients(val: any){
    if (val?.idPatient > 0) {
      return this.patients?.filter(el =>
        el.firstName.toLowerCase().includes(val.firstName.toLowerCase()) || el.lastName.toLowerCase().includes(val.lastName.toLowerCase()) || el.dni.includes(val)
      )
    } else {
      return this.patients?.filter(el =>
        el.firstName.toLowerCase().includes(val?.toLowerCase()) || el.lastName.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
      );
    }
  }

  showPatient(val: any){
    return val ? `${val.firstName} ${val.lastName}` : val;
  }

  loadInitialData() {
    this.patientService.findAll().subscribe(data => this.patients = data);
  }

  initForm() {
    if (this.isEdit) {

      this.vitalSignService.findById(this.id).subscribe(data => {

        this.patientControl.setValue(data.patient);

        this.form = new FormGroup({
          'idVitalSign': new FormControl(data.idVitalSign),
          'patient': this.patientControl,
          'date': new FormControl(data.date, [Validators.required, Validators.minLength(3)]),
          'temperature': new FormControl(data.temperature, [Validators.required, Validators.minLength(3)]),
          'heartbeat': new FormControl(data.heartbeat, [Validators.required, Validators.minLength(3)]),
          'respiratoryRate': new FormControl(data.respiratoryRate, [Validators.required, Validators.minLength(3)])
        });
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    if (this.form.invalid) { return; }

    let vitalSign = new VitalSign();
    vitalSign.idVitalSign = this.form.value['idVitalSign'];

    vitalSign.patient = this.form.value['patient'];
    vitalSign.date = moment(this.form.value['date']).format('YYYY-MM-DDTHH:mm:ss');
    vitalSign.temperature = this.form.value['temperature'];
    vitalSign.heartbeat = this.form.value['heartbeat'];
    vitalSign.respiratoryRate = this.form.value['respiratoryRate'];
    
    if (this.isEdit) {
      //UPDATE
      //PRACTICA COMUN
      this.vitalSignService.update(vitalSign).subscribe(() => {
        this.vitalSignService.findAll().subscribe(data => {
          this.vitalSignService.setVitalSignChange(data);
          this.vitalSignService.setMessageChange('Se modificó la información')

          this._exit()
        });
      });
    } else {      
      //INSERT
      //PRACTICA IDEAL
      this.vitalSignService.save(vitalSign).pipe(switchMap(()=>{        
        return this.vitalSignService.findAll();
      }))
      .subscribe(data => {
        this.vitalSignService.setVitalSignChange(data);
        this.vitalSignService.setMessageChange("Se registró la información")

        this._exit()
      });
    }
  }

  openDialog(){
    this._dialog.open(PatientDialogComponent, {
      width: '300px',
      data: null,
      disableClose: true
    }).beforeClosed().subscribe(() => {
      this.loadInitialData()
    });
  }

  _exit() {
    this.router.navigate(['/pages/vital-sign']);
  }
}
