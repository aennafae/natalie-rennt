import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'natalie-rennt';

  kilometer = 10;

  runs = new FormArray([]);

  addRun() {
    const group = new FormGroup({
      name: new FormControl('', [Validators.required]),
      km: new FormControl('', [Validators.required]),
      picture: new FormControl('', [Validators.required]),
    });
    this.runs.push(group);
  }
}
