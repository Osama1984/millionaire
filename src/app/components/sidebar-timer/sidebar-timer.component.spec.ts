import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarTimerComponent } from './sidebar-timer.component';

describe('SidebarTimerComponent', () => {
  let component: SidebarTimerComponent;
  let fixture: ComponentFixture<SidebarTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarTimerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
