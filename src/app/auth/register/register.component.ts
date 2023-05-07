import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.registerForm = this.createRegisterForm();
  }

  createRegisterForm(): FormGroup {
    return this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      username: ['', Validators.compose([Validators.required])],
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required])],
    });
  }

  submit() {
    console.log(this.registerForm.value);

    this.authService.register({
      email: this.registerForm.value.email,
      username: this.registerForm.value.username,
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword,
    }).subscribe(data => {
      console.log(data);
      this.notificationService.showSnackBar('Successfully registered');
    }, error => {
      console.log(error);
      this.notificationService.showSnackBar('Something went wrong during registration');
    });
  }
}
