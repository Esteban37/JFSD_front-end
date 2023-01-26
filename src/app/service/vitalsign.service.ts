import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { VitalSign } from '../model/vitalSign';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class VitalSignService extends GenericService<VitalSign>{
  //private url: string = `${environment.HOST}/vitalSigns`;
  private vitalSignChange = new Subject<VitalSign[]>;
  private messageChange = new Subject<string>;

  //constructor(private http: HttpClient) {}
  constructor(protected override http: HttpClient){
    super(
      http,
      `${environment.HOST}/vitalsigns`)
  }
  
  listPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }


  /*findAll() {
    //: Observable<Object | VitalSign[]>
    return this.http.get<VitalSign[]>(this.url);
  }

  findById(id: number) {    
    return this.http.get<VitalSign>(`${this.url}/${id}`);
  }

  save(vitalSign: VitalSign) {
    return this.http.post(this.url, vitalSign);
  }

  update(vitalSign: VitalSign) {
    return this.http.put(this.url, vitalSign);
  }

  delete(id: number) {    
    return this.http.delete(`${this.url}/${id}`);
  }*/

  ////////////////get & set ///////////////
  setVitalSignChange(data: VitalSign[]){
    this.vitalSignChange.next(data);
  }

  getVitalSignChange(){
    return this.vitalSignChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
