import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../services/user.service";
import {NotificationService} from "../../services/notification.service";
import {User} from "../../models/User";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  public;
  profileEditForm: FormGroup;
  private;

  constructor(private dialogRef: MatDialogRef<EditUserComponent>,
              private fb: FormBuilder,
              private userService: UserService,
              private notificationService: NotificationService,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit(): void {
    this.profileEditForm = this.createProfileForm();
  }

  createProfileForm(): FormGroup {
    return this.fb.group({
      firstName: [this.data.user.firstName, Validators.compose([Validators.required])],
      lastName: [this.data.user.lastName, Validators.compose([Validators.required])],
      bio: [this.data.user.bio, Validators.compose([Validators.required])],
    });
  }

  submit() {
    this.userService.updateUser(this.updateUser())
      .subscribe(() => {
        this.notificationService.showSnackBar('User updated successfully');
        this.dialogRef.close();
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateUser(): User {
    this.data.user.firstName = this.profileEditForm.value.firstName;
    this.data.user.lastName = this.profileEditForm.value.lastName;
    this.data.user.bio = this.profileEditForm.value.bio;
    return this.data.user;
  }

}
