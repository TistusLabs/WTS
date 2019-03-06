import {Component, Input} from '@angular/core';

@Component ({
    selector: 'app-wts-banner-common',
    templateUrl: './wts_banner_common.html',
    styleUrls: ['./wts_banner_common.scss']
})

export class BannerCommonComponent {
    @Input() user;
}
