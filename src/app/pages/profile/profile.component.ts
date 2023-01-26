import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username: string;
  authorities: [];

  constructor() { }

  ngOnInit(): void {
    const helper = new JwtHelperService();

    const decodedToken = helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME)); // Obtengo los datos del usuario
    this.username = decodedToken.user_name;
    this.authorities = decodedToken.authorities;

    console.log('User, ' + JSON.stringify(decodedToken))

  }

}
