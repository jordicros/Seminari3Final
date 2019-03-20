import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
declare var FB: any;



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  validation_messages: any;

  loginUserData = {}
  registerUserData={}

  constructor(private _auth: AuthService, private _router: Router, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)])),

        password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^(?=.*\d).{4,8}$/)]))
    })
   }
   

  ngOnInit() {
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : '2049546222009975',
        cookie     : true,
        xfbml      : true,
        version    : 'v3.2'
      });
      FB.AppEvents.logPageView();
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

    this.validation_messages = {
      'email': [
        { type: 'required', message: 'Email is required' },
        { type: 'pattern', message: 'Email must be valid. Must contain a @ and only one dot in the domain. Domain between 2 and 3 characters long' }
      ],
      'password': [
        { type: 'required', message: 'Password is required' },
        { type: 'pattern', message: 'Password must be valid. Must contain at least one number and must be between 4 and 8 characters' }
      ]
    }

    
    

  }

  
  submitLogin(){
    console.log("Mandando petición de logueo en Facebook...");
    //FB.login();
    FB.login((response)=>
        {
          if (response.authResponse)
          {
            this.registerUserData={
              email: response.email,
              password: response.password
            }

            this._auth.registerUsers(this.registerUserData)
            .subscribe(
                res => {
                      localStorage.setItem('token', res.token)
                      this._router.navigate(['/special'])
      },
      err => console.log("Ha ocurrido un error iniciando sesión con Facebook: "+err)
    ) 
            
           // this._router.navigate(['/special'])
            //login success
            //login success code here
            //redirect to home page
           }
           else
           {
           console.log('User login failed');
         }
      });
  }
  
  


  loginUser () {
    this._auth.loginUser(this.loginUserData)
    .subscribe(
      res => {
        console.log("Iniciando sesión al servidor API con los valores: "+this.loginUserData)
        localStorage.setItem('token', res.token)
        this._router.navigate(['/special'])
      },
      err => console.log("Ha ocurrido un error inciando sesión: "+err)
    ) 
  }
}
