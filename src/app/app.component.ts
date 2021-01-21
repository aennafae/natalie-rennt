import { state, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
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

  private calculateKilometer(runs: Run[]) {
    for (const run of runs) {
      if (run.km) {
        this.kilometer += run.km;
      }
    }
  }
}
