import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import { error } from 'util';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
    validation_messages: any;
  registerUserData = {}

  constructor(private _auth: AuthService,
    private _router: Router, private formBuilder: FormBuilder) {

this.registerForm = this.formBuilder.group({

  email: new FormControl('', Validators.compose([
  Validators.required,
  Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)])),

  password: new FormControl('', Validators.compose([
  Validators.required,
  Validators.pattern(/^(?=.*\d).{4,8}$/)])),
}
)
}

  ngOnInit() {
    this.validation_messages = {
      'email': [
        { type: 'required', message: 'Email is required' },
        { type: 'unique', message: 'Email must be unique'} ,
        { type: 'pattern', message: 'It must be valid. Must contain a @ and only one dot in the domain. Domain between 2 and 3 characters long' }
      ],
      'password': [
        { type: 'required', message: 'Password is required' },
        { type: 'pattern', message: 'It must be valid. Must contain at least one number and must be between 4 and 8 characters' }
      ]
    }

  }

  registerUsers() {
    this._auth.registerUsers(this.registerUserData)
    .subscribe(
      res => {
        localStorage.setItem('token', res.token)
        this._router.navigate(['/special'])
      },
      err => console.log("Error en el registre: "+err)
    )   
  }

}
