import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedularDemoComponent } from './schedular-demo.component';

describe('SchedularDemoComponent', () => {
  let component: SchedularDemoComponent;
  let fixture: ComponentFixture<SchedularDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedularDemoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchedularDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
