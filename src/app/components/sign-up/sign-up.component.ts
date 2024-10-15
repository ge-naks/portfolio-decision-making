import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { UserDataService } from '../../services/user-data.service';
import { UserParameters } from '../../models/user-parameters.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatCheckboxModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  constructor(private userDataService: UserDataService,
    private router: Router
  ) {}


  fName = null;
  lName = null;
  netID = null;
  DOB = null;
  isChecked = false;

  toNext() {
    this.userDataService.updateUserData('fName', this.fName)
    this.userDataService.updateUserData('lName', this.lName)
    this.userDataService.updateUserData('netID', this.netID)
    this.userDataService.updateUserData('DOB', this.DOB)

    console.log(this.userDataService.getUserData())

    this.router.navigate(['/question']);
  }

  completeCheck(): boolean {
    return (
      this.fName != null &&
      this.lName != null &&
      this.netID != null &&
      this.DOB != null &&
      this.isChecked
    );
  }

  readonly dialog = inject(MatDialog);
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(AgreementDialog, {
      width: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}

@Component({
  selector: 'agreement-dialog',
  templateUrl: 'agreement.html',
  standalone: true,
  styleUrl: './agreement.css',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatCheckboxModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementDialog {
  readonly dialogRef = inject(MatDialogRef<SignUpComponent>);
}
