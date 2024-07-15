import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SidebarLevelsComponent } from '../sidebar-levels/sidebar-levels.component';
import { SidebarScoreComponent } from '../sidebar-score/sidebar-score.component';
import { SidebarTimerComponent } from '../sidebar-timer/sidebar-timer.component';
import { HelpComponent } from '../help/help.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarLevelsComponent, SidebarScoreComponent, SidebarTimerComponent, HelpComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() place:string=''

  helpOptions = ['50/50', 'Phone a Friend', 'Ask the Audience'];

}
