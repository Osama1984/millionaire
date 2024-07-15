import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarScoreComponent } from './sidebar-score.component';

describe('SidebarScoreComponent', () => {
  let component: SidebarScoreComponent;
  let fixture: ComponentFixture<SidebarScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarScoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
