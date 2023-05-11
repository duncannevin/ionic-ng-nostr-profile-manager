import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelaysComponent } from './relays.component';

describe('RelaysComponent', () => {
  let component: RelaysComponent;
  let fixture: ComponentFixture<RelaysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelaysComponent]
    });
    fixture = TestBed.createComponent(RelaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
