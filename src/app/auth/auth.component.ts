import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
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

    _initGoogleSignin(element) {
        console.log(element.id);
        this.auth2.attachClickHandler(element, {},
            function(googleUser) {
                document.getElementById('name').innerText = "Signed in: " +
                    googleUser.getBasicProfile().getName();
            }, function(error) {
                alert(JSON.stringify(error, undefined, 2));
            });
    }
    _initFacebookSignin() {
        if (FB) {
            // FB.login();
            FB.login((response) => {
                console.log('submitLogin', response);
                if (response.authResponse) {
                    debugger
                } else {
                    console.log('User login failed');
                }
            });
        }
    }

    constructor() {
    }
    ngOnInit() {
        const self = this;
        // FACEBOOK auth initialization
        (window as any).fbAsyncInit = function() {
            FB.init({
                appId      : '2129279780720978',
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
                client_id: '822032164383-qqbmt84lubtd9c3niaoblpcpbfoq0qis.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                // Request scopes in addition to 'profile' and 'email'
                // scope: 'additional_scope'
            });
            self._initGoogleSignin(document.getElementById('wts-button-g'));
        });

    }

}
