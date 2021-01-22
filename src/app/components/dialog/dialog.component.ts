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

  pictureName = '';
  pictureBasepath = '';
  previewPicture = '';

  pictureWidth = 450;
  pictureHeight = 700;

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
        picture: this.pictureBasepath,
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

    if (!this.pictureBasepath) {
      isValid = false;
    }

    return isValid;
  }

  uploadImage(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.pictureName = '';
      Array.from(imgFile.target.files).forEach((file) => {
        this.pictureName += (file as File).name;
      });

      // Resize image first
      // create an off-screen canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // set its dimension to target size
      canvas.width = this.pictureWidth;
      canvas.height = this.pictureHeight;

      // HTML5 FileReader API
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = (rs) => {
          // draw source image into the off-screen canvas:
          if (ctx)
            ctx.drawImage(image, 0, 0, this.pictureWidth, this.pictureHeight);
          // encode image to data-uri with base64 version of compressed image
          this.pictureBasepath = canvas.toDataURL();
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);
    } else {
      this.pictureName = '';
    }
  }
}
