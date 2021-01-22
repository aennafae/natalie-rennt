import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
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
  });

  @ViewChild('pictureInput') pictureInput: ElementRef | undefined;
  fileAttr = 'Choose File';

  imageBasepath = '';

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private runService: RunService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveRun(): void {
    if (this.validateForm()) {
      const newRun: Run = {
        name: this.run.controls.name.value,
        km: parseInt(this.run.controls.km.value),
        picture: this.imageBasepath,
      };
      this.runService.addRun(newRun).subscribe((data) => {
        this.dialogRef.close();
      });
    } else {
    }
  }

  private validateForm(): boolean {
    let isValid = true;
    for (const controlKey of Object.keys(this.run.controls)) {
      const formObj = this.run.controls[controlKey];
      if (formObj.invalid) {
        isValid = false;
        formObj.markAsTouched();
      }
    }
    return isValid;
  }

  uploadImage(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.from(imgFile.target.files).forEach((file) => {
        this.fileAttr += (file as File).name + ' - ';
      });

      // HTML5 FileReader API
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = (rs) => {
          this.imageBasepath = e.target.result;
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);

      // Reset if duplicate image uploaded again
      /*  if (this.pictureInput) {
        this.pictureInput.nativeElement.value = '';
      } */
    } else {
      this.fileAttr = 'Choose File';
    }
  }
}
