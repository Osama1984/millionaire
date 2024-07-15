import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLevelsComponent } from './sidebar-levels.component';

describe('SidebarLevelsComponent', () => {
  let component: SidebarLevelsComponent;
  let fixture: ComponentFixture<SidebarLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarLevelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
