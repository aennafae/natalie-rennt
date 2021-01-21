import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Run } from '../../models/models';
import { RunService } from '../../services/run.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  run = new FormGroup({
    name: new FormControl('', [Validators.required]),
    km: new FormControl('', [Validators.required]),
    picture: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private runService: RunService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveRun(): void {
    const newRun: Run = {
      name: this.run.controls.name.value,
      km: parseInt(this.run.controls.km.value),
    };
    this.runService.addRun(newRun).subscribe((data) => {
      this.dialogRef.close();
    });
  }
}
