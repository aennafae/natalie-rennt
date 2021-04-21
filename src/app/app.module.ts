import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment.firebase';
import { AngularFireDatabaseModule } from '@angular/fire/database';

registerLocaleData(localeDe, localeDeExtra);

@NgModule({
  declarations: [AppComponent, DialogComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'natalie-rennt'),
    AngularFireDatabaseModule
  ],
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'de' },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { float: 'always' },
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { disableClose: true, hasBackdrop: true },
    },
  ],
  entryComponents: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
