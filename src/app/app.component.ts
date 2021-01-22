import { state, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { Run } from './models/models';
import { RunService } from './services/run.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'natalie-rennt';

  kilometer: number = 0;

  progressbarValue: number = 0;

  kilometerMax: number = 515;

  runs: Run[] = [];

  constructor(public dialog: MatDialog, private runService: RunService) {}

  ngOnInit() {
    this.getData();
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }

  private getData(): void {
    this.runService.getRuns().subscribe((data) => {
      this.runs = data.reverse();
      this.calculateKilometer(data);
    });
  }

  /**
   * Adds all km from runs.
   * Calculates Progressbar value to display. Progress value is 100% for 515km.
   * @param runs
   */
  private calculateKilometer(runs: Run[]) {
    this.kilometer = 0;
    for (const run of runs) {
      if (run.km) {
        this.kilometer += run.km;
      }
    }

    if (this.kilometer >= this.kilometerMax) {
      this.progressbarValue = 100;
    } else {
      this.progressbarValue = (this.kilometer * 100) / this.kilometerMax;
    }
  }
}
