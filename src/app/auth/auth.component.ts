import {Component, OnInit, ViewChild} from '@angular/core';
import * as $ from 'jquery';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {NgForm} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
declare var FB: any, gapi: any;

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    // G Client ID
    // 822032164383-qqbmt84lubtd9c3niaoblpcpbfoq0qis.apps.googleusercontent.com
    //
    // G Client Secret
    // iA2bZ60s_SEo-G3_qNnSAFPG

    public auth2: any;
    @ViewChild('usrForm') form: NgForm;
    temp_email = '';
    confirmUser = false;
    didFail = false;
    isLoading = false;
    signInOn = true;
    confirmOn = false;

    constructor(
        private router: Router,
        private authService: AuthService,
        private messages: MatSnackBar
    ) {
    }

    _initGoogleSignin(element) {
        console.log(element.id);
        const _self = this;
        this.auth2.attachClickHandler(element, {},
            function(googleUser) {
                if (document.getElementById('name')) document.getElementById('name').innerText = "Signed in: " + googleUser.getBasicProfile().getName();
                // localStorage.setItem('access_token', 'jwt');
                // _self.authService.broadcastToken();
                setTimeout(() => {
                    _self.router.navigateByUrl('/account');
                    }, 10
                );

            }, function(error) {
                // alert(JSON.stringify(error, undefined, 2));
                console.log("Google login cancelled");
            });
    }
    _initFacebookSignin() {
        if (FB) {
            // FB.login();
            const _self = this;
            FB.login((response) => {
                console.log('submitLogin', response);
                if (response.authResponse) {
                    // localStorage.setItem('access_token', 'jwt');
                    // _self.authService.broadcastToken();
                    _self.router.navigateByUrl('/account');
                } else {
                    console.log('Facebook login failed');
                    // localStorage.setItem('access_token', 'jwt');
                    // this.authService.broadcastToken();
                    // this.router.navigateByUrl('/account');
                }
            });
        }
    }

    ngOnInit() {
        const self = this;
        // FACEBOOK auth initialization
        (window as any).fbAsyncInit = function() {
            FB.init({
                appId      : '318190032367222',
                cookie     : true,
                xfbml      : true,
                version    : 'v3.2'
            });
            FB.AppEvents.logPageView();
        };

        (function(d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        // GOOGLE auth initialization
        gapi.load('auth2', function() {
            // Retrieve the singleton for the GoogleAuth library and set up the client.
            self.auth2 = gapi.auth2.init({
                client_id: '1078066678608-7uruq11vo35le57ovs9tv3ierb8c10af.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                // Request scopes in addition to 'profile' and 'email'
                // scope: 'additional_scope'
            });
            self._initGoogleSignin(document.getElementById('wts-button-g'));
        });

        this.authService.authIsLoading.subscribe(
            (isLoading: boolean) => this.isLoading = isLoading
        );
        this.authService.authDidFail
            .subscribe((didFail: boolean) => {
                this.didFail = didFail;
                if (this.isLoading) {
                    this.messages.open('Invalid credentials', null, {
                        duration: 1000,
                    });
                }
            });

        // this.authService.authDidSuccess
        //     .subscribe((didSuccess: boolean) => {
        //         if (didSuccess) {
        //             this.router.navigateByUrl('/account');
        //         }
        //     });

        this.authService.authConfirmOn
            .subscribe((onConfirm: boolean) => {
                this.confirmOn = onConfirm;
            });
    }

    goToSignup() {
        this.signInOn = !this.signInOn;
    }

    onLogin(e) {
        e.preventDefault();
        const usrName = this.form.value.username;
        const password = this.form.value.password;
        this.authService.signIn(usrName, password);
    }

    onSignup() {
        const mobile = this.form.value.mobile;
        const email = this.form.value.email;
        this.temp_email = this.form.value.email;
        const password = this.form.value.password;
        this.authService.signUp(email, password, mobile);
    }

    onDoConfirm() {
        this.confirmUser = true;
    }

    onConfirm() {
        const validationCode = this.form.value.validationCode;
        this.authService.confirmUser(this.temp_email, validationCode);
    }

}
