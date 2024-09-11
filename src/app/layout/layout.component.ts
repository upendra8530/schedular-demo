import { Component } from '@angular/core';
import { SchedularDemoComponent } from './schedular-demo/schedular-demo.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SchedularDemoComponent,SidebarComponent,TopbarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
