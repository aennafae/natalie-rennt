import { state, trigger } from '@angular/animations';
import { map } from 'rxjs/operators';
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
  runsLeft: Run[] = [];
  runsRight: Run[] = [];
  runsBottom: Run[] = [];
  runsBottomMore: Run[] = []; // When load more is clicked this array is filled

  constructor(public dialog: MatDialog, private runService: RunService) { }

  ngOnInit() {
    this.getData();
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getData();
    });
  }


  private getData(): void {
    this.runService.getFirstRuns().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(runs => {
      this.runs = runs;

      this.runsLeft = this.runs.slice(0, 3).map(i => {
        return i;
      });
      this.runsRight = this.runs.slice(3, 6).map(i => {
        return i;
      });
      this.runsBottom = this.runs.slice(6, this.runs.length).map(i => {
        return i;
      });

      this.calculateKilometer(runs);
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

  /**
   * 
   */
  loadMoreRuns(): void {
    const lastItemTime = this.runsBottom[this.runsBottom.length - 1].timestamp;
    if (lastItemTime) {
      this.runService.loadMoreRuns(lastItemTime).snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(runs => {
        this.runsBottom = [...this.runsBottom, ...runs];
      });
    }
  }
}
