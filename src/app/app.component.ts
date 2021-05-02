import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
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
  pageLoaded = false;

  kilometer: Promise<number> | undefined;
  progressbarValue: number = 0;
  kilometerMax: number = 515;
  runsToLoad: number = 10;
  showLoadMoreButton: boolean = false;

  runsFirst: Run[] = [];
  runsLeft: Run[] = [];
  runsRight: Run[] = [];
  runsBottom: Run[] = [];
  runsBottomMore: Run[] = []; // When load more is clicked this array is filled

  allRuns: Promise<Run[]> | undefined;
  runsLoading = false;

  // Width of the red background container for show the km on the map
  mapKmWidth = '30.6%';

  constructor(public dialog: MatDialog, private runService: RunService) {
    this.runService.getAllRuns().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(runs => {
      if (runs.length <= this.runsToLoad) {
        this.showLoadMoreButton = false;
      } else {
        this.showLoadMoreButton = true;
      }

      this.allRuns = new Promise((resolve) => {
        resolve(runs);
      })
      this.kilometer = this.calculateKilometer(runs);
    });
  }

  ngOnInit() {
    this.getFirstRuns();
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getFirstRuns();
    });
  }

  /**
   * 
   */
  private getFirstRuns(): void {
    this.runService.getFirstRuns().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(runs => {
      runs.reverse();
      this.runsFirst = runs;
      this.runsLeft = this.runsFirst.slice(0, 3).map(i => {
        return i;
      });
      this.runsRight = this.runsFirst.slice(3, 6).map(i => {
        return i;
      });
      this.runsBottom = this.runsFirst.slice(6, this.runsFirst.length).map(i => {
        return i;
      });

      setTimeout(() => {
        this.pageLoaded = true;
      }, 600)
    });
  }

  /**
   * Adds all km from runs.
   * Calculates Progressbar value to display. Progress value is 100% for 515km.
   * @param runs
   */
  private calculateKilometer(runs: Run[]): Promise<number> {
    return new Promise((resolve) => {
      let kilometer = 0;
      for (const run of runs) {
        if (run.km) {
          kilometer += run.km;
        }
      }

      // If kilometers are more than maximum kilometers progressbar is set to 100%
      if (kilometer >= this.kilometerMax) {
        this.progressbarValue = 100;
        this.mapKmWidth = '100%'
      } else {
        const kmInPercent = (kilometer * 50 / this.kilometerMax) + 30.6;
        this.mapKmWidth = kmInPercent.toString() + '%';
        this.progressbarValue = kilometer * 100 / this.kilometerMax;
      }
      resolve(kilometer);
    });
  }

  /**
   * 
   */
  showMoreRuns(): void {
    this.runsLoading = true;
    this.allRuns?.then(runs => {
      runs.reverse();

      //Current runs amount visible
      const currentAmount = this.runsLeft.length + this.runsRight.length + this.runsBottom.length;
      const moreRuns = runs.slice(currentAmount, currentAmount + this.runsToLoad);

      if (currentAmount < runs.length) {
        this.showLoadMoreButton = true;
      } else {
        this.showLoadMoreButton = false;
      }

      this.runsBottom = [...this.runsBottom, ...moreRuns];
      this.runsLoading = false;

      setTimeout(() => {
        this.scrollToBottom();
      }, 100)
    });
  }

  private scrollToBottom(): void {
    document.getElementById('load-more-runs-button')?.scrollIntoView({ behavior: 'smooth' });
  }
}
