import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import * as $ from 'jquery';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
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
    geolocloading = false;
    loading = false;
    signInOn = true;
    confirmOn = false;
    countryCode = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private toasterService: ToasterService,
        private _ngZone: NgZone
    ) {
    }

    _initGoogleSignin(element) {
        // console.log(element.id);
        const _self = this;
        this.auth2.attachClickHandler(element, {},
            function (googleUser) {
                if (document.getElementById('name')) document.getElementById('name').innerText = "Signed in: " + googleUser.getBasicProfile().getName();
                _self.authService.signUpGoogle_init(googleUser);
            }, function (error) {
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
                    _self.authService.signUpFB_init(response.authResponse.accessToken);
                } else {
                    console.log('Facebook login failed');
                }
            });
        }
    }

    ngOnInit() {
        this.signInOn = this.route.snapshot.data['signin'];
        const self = this;
        // FACEBOOK auth initialization
        (window as any).fbAsyncInit = function () {
            FB.init({
                appId: '318190032367222',
                cookie: true,
                xfbml: true,
                version: 'v3.2'
            });
            FB.AppEvents.logPageView();
        };

        (function (d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        // GOOGLE auth initialization
        gapi.load('auth2', function () {
            // Retrieve the singleton for the GoogleAuth library and set up the client.
            self.auth2 = gapi.auth2.init({
                client_id: '1078066678608-7uruq11vo35le57ovs9tv3ierb8c10af.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                // Request scopes in addition to 'profile' and 'email'
                // scope: 'additional_scope'
            });
            // self._initGoogleSignin(document.getElementById('wts-button-g'));̀
        });

        this.authService.authIsLoading.subscribe(
            (isLoading: boolean) => this.isLoading = isLoading
        );
        this.authService.authDidFail
            .subscribe((didFail: boolean) => {
                this.didFail = didFail;
                if (this.isLoading) {
                    // this.messages.open('Invalid credentials', null, {
                    //     duration: 1000,
                    // });
                }
            });

        this.authService.authDidSuccess
            .subscribe((didSuccess: boolean) => {
                if (didSuccess) {
                    this.router.navigateByUrl('/');
                    this._ngZone.run(() => { console.log('Outside Done!'); });
                    this.signInOn = true;
                }
            });

        this.authService.authStatusChanged.subscribe(status => {
            if (status) {
                this.signInOn = true;
                this.confirmOn = false;
            }
        });

        this.authService.authConfirmOn
            .subscribe((onConfirm: boolean) => {
                this.confirmOn = onConfirm;
            });

        // Geolocation
        const _self = this;
        this.geolocloading = true;
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            this.authService.getCountry(lat, lon).subscribe(country => {
                if (country['status'] === 'OK') {
                    let _country = null;
                    const _address_comps = country['results'];
                    for (const x of _address_comps) {
                        for (let i = 0; i < x['address_components'].length; i++) {
                            const addressType = x['address_components'][i]['types'][0];
                            if (addressType === 'country') {
                                _country = x['address_components'][i]['short_name'];
                                break;
                            }
                        }
                    }
                    _self.authService.getCountryCode()
                        .subscribe(codes => {
                            const _codes = codes;
                            const code = _codes['filter'](c => {
                                if (c.code === _country) return c.dial_code;
                            });
                            _self.countryCode = code[0].dial_code;
                            _self.geolocloading = false;
                        });
                } else {
                    _self.geolocloading = false;
                    _self.toasterService.pop('error', 'Faild to identify country', 'Sorry, we were unable to understand where you are from. Please use the correct country code for your phone number when Signing Up');
                }
            });
        });

        this.adjustBannerHeight();
    }

    adjustBannerHeight () {
        const height = window.innerHeight;
        document.getElementById("wts-onboarding").setAttribute("style", "height:" + (height-50) +"px");
    }

    goToSignup() {
        // this.signInOn = false;
        this.router.navigateByUrl('/auth/signup');
    }

    goToSignin() {
        // this.signInOn = true;
        this.router.navigateByUrl('/auth/signin');
    }

    onLogin(e) {
        this.loading = true;
        e.preventDefault();
        const usrName = this.form.value.username;
        const password = this.form.value.password;
        this.authService.signIn(usrName, password);
    }

    onSignup() {
        this.loading = true;
        const mobile = this.countryCode ? this.countryCode + this.form.value.mobile : this.form.value.mobile;
        const email = this.form.value.email;
        this.temp_email = this.form.value.email;
        const password = this.form.value.password;
        this.authService.signUp(email, password, mobile.replace(/ /g, ''));
    }

    onDoConfirm() {
        this.confirmUser = true;
    }

    onConfirm() {
        const validationCode = this.form.value.validationCode;
        this.authService.confirmUser(this.temp_email, validationCode);
    }

}
