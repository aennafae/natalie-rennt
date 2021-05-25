import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { Run, Score } from './models/models';
import { RunService } from './services/run.service';
import * as _ from 'lodash';
import { ScoreService } from './services/score.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'natalie-rennt';
  pageLoaded = false;

  kilometer: Promise<number> | undefined;
  championlist: Score[] | undefined;
  progressbarValue: number = 0;
  kilometerMax: number = 515;
  numberOfRunsToLoad: number = 12;
  showLoadMoreButton: boolean = false;

  runsFirst: Run[] = [];
  runsLeft: Run[] = [];
  runsRight: Run[] = [];
  runsBottom: Run[] = [];
  runsBottomMore: Run[] = []; // When load more is clicked this array is filled

  allRuns$: Promise<Run[]> | undefined;
  runsLoading = false;

  // Width of the red background container for show the km on the map
  mapKmWidth = '30.6%';

  constructor(public dialog: MatDialog,
    private runService: RunService,
    private scoreService: ScoreService) {
    this.getAllRuns();
    this.getChampions();
  }

  ngOnInit() {
    this.getFirstRuns();
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '500px',
    });
    /*let dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getFirstRuns();
    });*/
  }

  private getAllRuns(): void {
    this.runService.getAllRuns().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(runs => {
      const visibleRuns = this.getPublicRuns(runs);

      if (visibleRuns.length < this.numberOfRunsToLoad) {
        this.showLoadMoreButton = false;
      } else {
        this.showLoadMoreButton = true;
      }

      this.kilometer = this.calculateKilometer(runs);

      this.allRuns$ = new Promise((resolve) => {
        resolve(visibleRuns);
      });
    });
  }

  private getChampions(): void {
    this.scoreService.getScore().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(score => {
      this.championlist = score;
    });
  }

  /**
   * 
   */
  private getFirstRuns(): void {
    this.runService.getAllRuns().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(runs => {
      _.sortBy(runs, ['timestamp']);
      runs.reverse();

      this.runsFirst = _.filter(runs, _.matches({ isPublic: true }));;
      this.runsFirst = this.runsFirst.slice(0, this.numberOfRunsToLoad); // Only 12 to show at first

      this.runsLeft = this.runsFirst.slice(0, 4).map(run => {
        return run;
      });
      this.runsRight = this.runsFirst.slice(4, 8).map(run => {
        return run;
      });
      this.runsBottom = this.runsFirst.slice(8, this.runsFirst.length).map(run => {
        return run;
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
        this.mapKmWidth = '100%';
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
    this.allRuns$?.then(runs => {
      //Current runs amount visible
      const currentAmount = this.runsLeft.length + this.runsRight.length + this.runsBottom.length;
      //load from current amount to +10 more
      const moreRuns = runs.slice(currentAmount, currentAmount + this.numberOfRunsToLoad);

      this.runsBottom = [...this.runsBottom, ...moreRuns];
      this.runsLoading = false;

      if ((currentAmount + moreRuns.length) < runs.length) {
        this.showLoadMoreButton = true;
      } else {
        this.showLoadMoreButton = false;
      }
      setTimeout(() => {
        this.scrollToBottom();
      }, 100)
    });
  }

  private scrollToBottom(): void {
    document.getElementById('load-more-runs-button')?.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Gibt nur die Runs mit isPublic=true zurück.
   * @param runs 
   * @returns Array mit Daten sortiert Neuste zuerst und isPublic=true
   */
  private getPublicRuns(runs: Run[]): Run[] {
    _.sortBy(runs, ['timestamp']);
    runs.reverse();
    return _.filter(runs, _.matches({ isPublic: true }));;
  }
}
