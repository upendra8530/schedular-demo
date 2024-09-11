// Import the TreeViewModule
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule // Add this line to import the Syncfusion TreeView module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
