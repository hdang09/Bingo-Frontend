import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ionLogoGoogle } from '@ng-icons/ionicons';
import { faSolidSpinner } from '@ng-icons/font-awesome/solid';
import config from '../../config';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { CreateAccount } from '../../types';
import { environment } from '../../../environment/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, NgIconComponent, FormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  viewProviders: [provideIcons({ ionLogoGoogle, faSolidSpinner })],
})
export class LoginComponent implements OnInit {
  fullName = '';
  isLoading = false;
  langs = Object.keys(config.langs);
  defaultLang = localStorage.getItem('defaultLang') || 'en';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {
    this.translate.addLangs(Object.keys(config.langs));
    this.translate.setDefaultLang(this.defaultLang);
  }

  ngOnInit(): void {
    // Check token in local storage
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (!decodedToken?.exp) {
        this.router.navigate([config.routes.login]);
        return;
      }

      if (decodedToken.exp < currentTime) {
        this.router.navigate([config.routes.rooms]);
      } else {
        this.router.navigate([config.routes.login]);
        return;
      }
    } else {
      this.router.navigate([config.routes.login]);
      return;
    }
  }

  loginGuest() {
    this.isLoading = true;

    const account: CreateAccount = {
      fullName: this.fullName,
    };

    this.authService.login(account).subscribe(
      (response) => {
        localStorage.setItem('token', response.data.accessToken);
        this.isLoading = false;
        this.router.navigate([config.routes.rooms]);
      },
      (error) => {
        this.isLoading = false;

        Object.values(error.error.data).forEach((message: any) => {
          this.toastr.error(message);
        });
      }
    );
  }

  loginGoogle() {
    window.location.href = environment.apiUrl + '/api/v1/auth/login/google';
  }

  changeLang(lang: string) {
    localStorage.setItem('defaultLang', lang);
    this.defaultLang = lang;
    this.translate.use(lang);
  }
}
