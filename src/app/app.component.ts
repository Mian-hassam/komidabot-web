import {Component, OnDestroy, OnInit} from '@angular/core';
import {CheckForUpdateService} from './check-for-update.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {SwUpdate, VersionReadyEvent} from '@angular/service-worker';
import {Observable, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {SettingsService} from './service-settings/settings.service';
import {Router} from '@angular/router';
import {faCog, faKey} from '@fortawesome/free-solid-svg-icons';
import {SeoService} from './seo.service';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  faCog = faCog;
  faKey = faKey;

  private unsubscribe$ = new Subject<void>();

  deviceInfo: DeviceInfo;
  displaySplash: boolean;
  updateAvailable = false;
  botRedirect = false;

  language$: Observable<string>;

  // noinspection JSUnusedLocalSymbols
  constructor(
    private deviceService: DeviceDetectorService,
    private updates: SwUpdate,
    private router: Router,
    // Add here to force starting this service
    private updateService: CheckForUpdateService,
    private settings: SettingsService,
    private seo: SeoService,
  ) {
    this.displaySplash = window.location.pathname === '/pwa_start';

    this.updates.versionUpdates
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(_ => this.updateAvailable = true);

    this.language$ = this.settings.getLanguage();
  }

  ngOnInit(): void {
    const ua = this.deviceService.userAgent;
    // Add custom check for facebook, as it's not possible to add the app to your homescreen from their browser
    const isFacebook = ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;

    this.deviceInfo = {
      user_agent: this.deviceService.userAgent,
      browser: this.deviceService.browser,
      browser_version: this.deviceService.browser_version,
      device: this.deviceService.device,
      os: this.deviceService.os,
      os_version: this.deviceService.os_version,
      is_desktop: this.deviceService.isDesktop(),
      is_tablet: this.deviceService.isTablet(),
      is_mobile: this.deviceService.isMobile(),
      is_facebook: isFacebook,
    };
    console.log(this.deviceService.getDeviceInfo());

    if (this.displaySplash) {
      // Only display on devices we know this works on
      if (this.deviceInfo.browser !== 'Chrome' || this.deviceInfo.os !== 'Android') {
        this.displaySplash = false;
      }
      // this.displaySplash = this.deviceInfo.is_mobile || this.deviceInfo.is_tablet;
    }

    // this.displaySplash = true;

    this.botRedirect = window.location.hostname === 'komidabot.heldplayer.blue';
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onRouterActivate(event: any) {
    this.seo.setActiveComponent(event);
  }

  refreshPage() {
    document.location.reload();
  }

  splashComplete() {
    this.displaySplash = false;
  }

  setLanguage(language: string) {
    this.settings.setLanguage(language);
  }

  isOnSettings(): boolean {
    return this.router.isActive('/settings', true);
  }
}

interface DeviceInfo {
  user_agent: string;
  browser: string;
  browser_version: string;
  device: string;
  os: string;
  os_version: string;
  is_desktop: boolean;
  is_tablet: boolean;
  is_mobile: boolean;
  is_facebook: boolean;
}
