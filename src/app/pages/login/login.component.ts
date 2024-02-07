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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, NgIconComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  viewProviders: [provideIcons({ ionLogoGoogle, faSolidSpinner })],
})
export class LoginComponent implements OnInit {
  fullName = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Check token in local storage
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate([config.routes.rooms]);
    } else {
      this.router.navigate([config.routes.login]);
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
        this.toastr.error(error.error.message);
        this.toastr.error(error.error.message);
      }
    );
  }

  loginGoogle() {
    window.location.href = environment.apiUrl + '/api/v1/auth/login/google';
  }
}